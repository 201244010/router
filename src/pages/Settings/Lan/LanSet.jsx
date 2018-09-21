
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { Button, Modal} from 'antd';

const { FormItem, ErrorTip, Input : FormInput, InputGroup, Input } = Form;

export default class Lan extends React.Component {
    state = {
        ipv4 : ['', '', '', ''],
        mask : ['', '', '', ''],
        dhcp: true,
        startip : ['', '', '', ''],
        endip : ['', '', '', ''],
        leasetime : '',
        tip : "",
        disabled : false,
        loading : false
    };

    onChange = (val, key) => {
        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val)
        });
    }

    submit = async () => {
        this.summitLan();
        this.summitDhcp();
    }

    async fetchLanInfo() {
        let response = await common.fetchWithCode('NETWORK_LAN_IPV4_GET', { method: 'POST' }, { handleError: true })
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
        await Modal.warning({
            title: '提示',
            content: '局域网IP地址、子网掩码或地址池发生变更，静态地址可能失效',
        });

        this.lanInfo.ipv4 = this.state.ipv4.join('.');
        this.lanInfo.mask = this.state.mask.join('.');

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
        let response = await common.fetchWithCode('DHCPS_GET', { method: 'POST' }, { handleError: true })
        let { errcode, data, message } = response;
        if (errcode == 0) {
            let { dhcps } = data[0].result;
            this.dhcps = dhcps;
            this.setState({
                dhcp: this.dhcps.enable,
                startip: [...this.dhcps.startip.split('.')],
                endip: [...this.dhcps.endip.split('.')],
                leasetime: this.dhcps.leasetime
            });
            return;
        }

        Modal.error({ title: '获取DHCP服务器配置指令异常', message });
    }

    summitDhcp = async () => {
        this.dhcps.enable = this.state.dhcp;
        this.dhcps.startip = this.state.startip.join('.');
        this.dhcps.endip = this.state.endip.join('.');
        this.dhcps.leasetime = this.state.leasetime;

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
        const { ipv4, mask, dhcp, startip, endip, leasetime, tip, disabled, loading } = this.state;
        return (
        <div className="lan-settting">
                <Form>
                    <section className="content-item">
                        <PanelHeader title="局域网IP地址" />
                        <label style={{ marginTop: 24 }}>IP地址</label>
                        <FormItem style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: ipv4[0], maxLength: 3 }, { value: ipv4[1], maxLength: 3 }, { value: ipv4[2], maxLength: 3 }, { value: ipv4[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'ipv4')} />
                        </FormItem>
                        <label>子网掩码</label>
                        <FormItem style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: mask[0], maxLength: 3 }, { value: mask[1], maxLength: 3 }, { value: mask[2], maxLength: 3 }, { value: mask[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'mask')} />
                        </FormItem>
                    </section>
                    <section className="content-item">
                        <PanelHeader title="DHCP服务" checkable={true} checked={dhcp} />
                        <label style={{ marginTop: 24 }}>开始IP地址</label>
                        <FormItem style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: startip[0], maxLength: 3 }, { value: startip[1], maxLength: 3 }, { value: startip[2], maxLength: 3 }, { value: startip[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'startip')} />
                        </FormItem>
                        <label>结束IP地址</label>
                        <FormItem style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: endip[0], maxLength: 3 }, { value: endip[1], maxLength: 3 }, { value: endip[2], maxLength: 3 }, { value: endip[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'endip')} />
                        </FormItem>
                        <label>地址租期</label>
                        <FormItem showErrorTip={tip} type="small" style={{ width: 320 }}>
                            <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>分钟</label>
                            <Input type="text" value={leasetime} onChange={value => this.onChange(value, 'leasetime')} placeholder="请输入租期时间（2～1440）" maxLength="4" />
                            <ErrorTip>{tip}</ErrorTip>
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







