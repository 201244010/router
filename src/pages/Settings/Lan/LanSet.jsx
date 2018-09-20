
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { Button, Modal} from 'antd';

const { FormItem, ErrorTip, Input : FormInput, InputGroup, Input } = Form;

export default class Lan extends React.Component {
    state = {
        ip : ['', '', '', ''],
        netmask : ['', '', '', ''],
        dhcp: true,
        startIp : ['', '', '', ''],
        endIp : ['', '', '', ''],
        leaseTime : '',
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
                ip: [...this.lanInfo.ipv4.split('.')],
                netmask: [...this.lanInfo.mask.split('.')]
            });
            return;
        }

        Modal.error({ title: '获取局域网配置指令异常', message });
    }

    summitLan = async () => {
        Modal.warning({
            title: '提示',
            content: '局域网IP地址、子网掩码或地址池发生变更，静态地址可能失效',
        });

        this.lanInfo.ipv4 = this.state.ip.join('.');
        this.lanInfo.mask = this.state.netmask.join('.');

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
                startIp: [...this.dhcps.startip.split('.')],
                endIp: [...this.dhcps.endip.split('.')],
                leaseTime: this.dhcps.leasetime
            });
            return;
        }

        Modal.error({ title: '获取DHCP服务器配置指令异常', message });
    }

    summitDhcp = async () => {
        this.dhcps.enable = this.state.dhcp;
        this.dhcps.startip = this.state.startIp;
        this.dhcps.endip = this.state.endIp;
        this.dhcps.leasetime = this.state.leaseTime;

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
        const { ip, netmask, dhcp, startIp, endIp, leaseTime, tip, disabled, loading } = this.state;
        return (
        <div className="lan-settting">
                <Form>
                    <section className="content-item">
                        <PanelHeader title="局域网IP地址" />
                        <label style={{ marginTop: 24 }}>IP地址</label>
                        <FormItem style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: ip[0], maxLength: 3 }, { value: ip[1], maxLength: 3 }, { value: ip[2], maxLength: 3 }, { value: ip[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'ip')} />
                        </FormItem>
                        <label>子网掩码</label>
                        <FormItem style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: netmask[0], maxLength: 3 }, { value: netmask[1], maxLength: 3 }, { value: netmask[2], maxLength: 3 }, { value: netmask[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'netmask')} />
                        </FormItem>
                    </section>
                    <section className="content-item">
                        <PanelHeader title="DHCP服务" checkable={true} checked={dhcp} />
                        <label style={{ marginTop: 24 }}>开始IP地址</label>
                        <FormItem style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: startIp[0], maxLength: 3 }, { value: startIp[1], maxLength: 3 }, { value: startIp[2], maxLength: 3 }, { value: startIp[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'startIp')} />
                        </FormItem>
                        <label>结束IP地址</label>
                        <FormItem style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: endIp[0], maxLength: 3 }, { value: endIp[1], maxLength: 3 }, { value: endIp[2], maxLength: 3 }, { value: endIp[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'endIp')} />
                        </FormItem>
                        <label>地址租期</label>
                        <FormItem showErrorTip={tip} type="small" style={{ width: 320 }}>
                            <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>分钟</label>
                            <Input type="text" value={leaseTime} onChange={value => this.onChange(value, 'leaseTime')} placeholder="请输入租期时间（2～1440）" />
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







