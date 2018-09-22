
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { checkIp, checkRange, checkMask, checkSameNet, transIp} from '~/assets/common/check';
import { Button, Modal} from 'antd';

const { FormItem, ErrorTip, Input : FormInput, InputGroup, Input } = Form;

export default class Lan extends React.Component {
    state = {
        ipv4 : ['', '', '', ''],
        mask : ['', '', '', ''],
        enable: true,
        startip : ['', '', '', ''],
        endip : ['', '', '', ''],
        leasetime : '',
        ipv4Tip : "",
        maskTip :"",
        startipTip :"",
        endipTip :"",
        leasetimeTip :"",
        disabled : true,
        loading : false
    };

    onChange = (val, key) => {
        let tip = '',
            startipTip = '',
            endipTip = '';

        switch(key){
            case 'ipv4':
                if (0 !== checkIp(val)){
                    tip = 'IP地址非法，请重新输入';
                }
                break;
            case 'mask':
                if (!checkMask(val)) {
                    tip = '子网掩码非法，请重新输入';
                }
                break;
            case 'enable':
                break;
            case 'startip':
                if (0 !== checkIp(val)) {
                    tip = '开始IP地址非法，请重新输入';
                }
                break;
            case 'endip':
                if (0 !== checkIp(val)) {
                    tip = '结束IP地址非法，请重新输入';
                }
                break;
            case 'leasetime':
                if (!checkRange(val, 2, 1440)) {
                    tip = '地址租期非法，请重新输入';
                }
                break;
        }

        if ('startip' !== key && (0 !== checkIp(this.state.startip))){
            startipTip = '开始IP地址非法，请重新输入';
        }

        if ('endip' !== key && (0 !== checkIp(this.state.endip))) {
            endipTip = '结束IP地址非法，请重新输入';
        }

        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val),
            [key + 'Tip']: tip,
            startipTip: startipTip,
            endipTip: endipTip
        }, () => {  // 这里用户输入合法后我们才检查是否同一个网段
            let st = this.state;
            let tip = ['ipv4Tip', 'maskTip', 'startipTip', 'endipTip', 'leasetimeTip'];
            let ok = tip.every((tip) => { return '' === st[tip]});

            if (ok) {
                let num2ip = (num) => {
                    let ip3 = (num << 0) >>> 24;
                    let ip2 = (num << 8) >>> 24;
                    let ip1 = (num << 16) >>> 24;
                    let ip0 = (num << 24) >>> 24

                    return `${ip3}.${ip2}.${ip1}.${ip0}`;
                }

                let netId = (transIp(st.ipv4) & transIp(st.mask)) >>> 0;
                let netMax = ~transIp(st.mask);
                let minStr = num2ip((netId + 1));
                let maxStr = num2ip((netId + netMax - 1));
                let range = `(${minStr} - ${maxStr})`;
                if (!checkSameNet(st.ipv4, st.startip, st.mask)) {
                    this.setState({ startipTip: '地址池与局域网IP应处于同一网段' + range });
                    return;
                }

                if (!checkSameNet(st.ipv4, st.endip, st.mask)) {
                    this.setState({ endipTip: '地址池与局域网IP应处于同一网段' + range });
                    return;
                }

                if (transIp(st.startip) >= transIp(st.endip)) {
                    this.setState({ endipTip: '结束IP需大于开始IP' });
                    return;
                }

                this.setState({ disabled: false });
            } else {
                this.setState({ disabled: true });
            }
        });
    }

    submit = async () => {
        await Modal.warning({
            title: '提示',
            content: '局域网IP地址、子网掩码或地址池发生变更，静态地址可能失效',
            okText: '知道了',
            onOk:() => {
                this.summitLan();
                this.summitDhcp();
            }
        });
    }

    async fetchLanInfo() {
        let response = await common.fetchWithCode('NETWORK_LAN_IPV4_GET', { method: 'POST' })
        let { errcode, data, message } = response;
        if (errcode == 0) {
            let { lan } = data[0].result;
            this.lanInfo = lan.info;
            this.setState({
                ipv4: [...this.lanInfo.ipv4.split('.')],
                mask: [...this.lanInfo.mask.split('.')]
            });
            return;
        }

        Modal.error({ title: '获取局域网配置指令异常', message });
    }

    summitLan = async () => {
        this.lanInfo.ipv4 = this.state.ipv4.join('.');
        this.lanInfo.mask = this.state.mask.join('.');

        this.setState({ loading: true });
        let response = await common.fetchWithCode(
            'NETWORK_LAN_IPV4_SET',
            { method: 'POST', data: { lan: {info:this.lanInfo }} }
        ).catch(ex => { });

        this.setState({ loading: false });

        let { errcode, message } = response;
        if (errcode == 0) {
            return;
        }
        Modal.error({ title: '局域网IP地址设置失败', content: message });
    }

    async fetchDhcpsInfo() {
        let response = await common.fetchWithCode('DHCPS_GET', { method: 'POST' })
        let { errcode, data, message } = response;
        if (errcode == 0) {
            let { dhcps } = data[0].result;
            this.dhcps = dhcps;
            this.setState({
                enable: this.dhcps.enable,
                startip: [...this.dhcps.startip.split('.')],
                endip: [...this.dhcps.endip.split('.')],
                leasetime: this.dhcps.leasetime
            }, () => {
                console.log(this.state)
            });
            return;
        }

        Modal.error({ title: '获取DHCP服务器配置指令异常', message });
    }

    summitDhcp = async () => {
        this.dhcps.enable = this.state.enable;
        this.dhcps.startip = this.state.startip.join('.');
        this.dhcps.endip = this.state.endip.join('.');
        this.dhcps.leasetime = this.state.leasetime;

        this.setState({ loading: true });
        let response = await common.fetchWithCode(
            'DHCPS_SET',
            { method: 'POST', data: { dhcps: this.dhcps } }
        ).catch(ex => { });

        this.setState({ loading: false });

        let { errcode, message } = response;
        if (errcode == 0) {
            return;
        }
        Modal.error({ title: 'DHCP服务设置失败', content: message });
    }

    componentDidMount() {
        this.fetchLanInfo();
        this.fetchDhcpsInfo();
    }

    render(){
        const { ipv4, mask, enable, startip, endip, leasetime, ipv4Tip, maskTip,startipTip,endipTip, leasetimeTip, disabled, loading } = this.state;
        return (
        <div className="lan-settting">
                <Form>
                    <section className="content-item">
                        <PanelHeader title="局域网IP地址" />
                        <label style={{ marginTop: 24 }}>IP地址</label>
                        <FormItem showErrorTip={ipv4Tip} style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: ipv4[0], maxLength: 3 }, { value: ipv4[1], maxLength: 3 }, { value: ipv4[2], maxLength: 3 }, { value: ipv4[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'ipv4')} />
                            <ErrorTip>{ipv4Tip}</ErrorTip>
                        </FormItem>
                        <label>子网掩码</label>
                        <FormItem showErrorTip={maskTip} style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: mask[0], maxLength: 3 }, { value: mask[1], maxLength: 3 }, { value: mask[2], maxLength: 3 }, { value: mask[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'mask')} />
                            <ErrorTip>{maskTip}</ErrorTip>
                        </FormItem>
                    </section>
                    <section className="content-item">
                        <PanelHeader title="DHCP服务" checkable={true} checked={enable} onChange={value => this.onChange(value, 'enable')} />
                        <label style={{ marginTop: 24 }}>开始IP地址</label>
                        <FormItem showErrorTip={startipTip} style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: startip[0], maxLength: 3 }, { value: startip[1], maxLength: 3 }, { value: startip[2], maxLength: 3 }, { value: startip[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'startip')} />
                            <ErrorTip>{startipTip}</ErrorTip>
                        </FormItem>
                        <label>结束IP地址</label>
                        <FormItem showErrorTip={endipTip} style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: endip[0], maxLength: 3 }, { value: endip[1], maxLength: 3 }, { value: endip[2], maxLength: 3 }, { value: endip[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'endip')} />
                            <ErrorTip>{endipTip}</ErrorTip>
                        </FormItem>
                        <label>地址租期</label>
                        <FormItem showErrorTip={leasetimeTip} type="small" style={{ width: 320 }}>
                            <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>分钟</label>
                            <Input type="text" value={leasetime} onChange={value => this.onChange(value, 'leasetime')} placeholder="请输入租期时间（2～1440）" maxLength="4" />
                            <ErrorTip>{leasetimeTip}</ErrorTip>
                        </FormItem>
                    </section>
                </Form>
                <div className="save">
                    <Button disabled={disabled} loading={loading} style={{ width: 320, margin: "20px 60px 30px" }} onClick={this.submit} size="large" type="primary">保存</Button>
                </div>
        </div>
        );
    }
};







