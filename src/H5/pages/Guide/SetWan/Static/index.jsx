import React from 'react';
import Form from 'h5/Components/Form';
import Button from 'h5/components/Button';
import GuideHeader from 'h5/components/GuideHeader';
import Link from 'h5/components/Link';
import { checkIp, checkMask } from '~/assets/common/check';
import { detect } from './wan';

export default class Static extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        ip: '',
        ipTip: '',
        subnetmask: '',
        subnetmaskTip: '',
        gateway: '',
        gatewayTip: '', 
        dns: '',
        dnsTip: '',
        dnsbackup: '',
        dnsbackupTip: '',
        loading: true,
    }

    onChange = (name, value) => {
        let valid = {
            ip:{
                func: checkIp,
                who:'IP地址',
            },
            subnetmask:{
                func: checkMask,
                who:'子网掩码',
            },
            gateway:{
                func: checkIp,
                who:'默认网关',
            },
            dns:{
                func: checkIp,
                who:'首选DNS',
            },
            dnsbackup:{
                func: (value) => {
                    if('' === value){
                        return '';
                    }else {
                        return checkIp(value, { who: '备选DNS' });
                    }
                },
                who:'备选DNS',
            },
        }

        let tip = valid[name].func(value, { who: valid[name].who });

        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        });
    }

    submit = async () => {
        this.setState({ loading : true });
        const { ip, subnetmask, gateway, dns, dnsbackup } = this.state;
        response = await common.fetchApi(
            {
                opcode: 'NETWORK_WAN_IPV4_SET',
                data:{
                    wan:{
                        dial_type: 'static',
                        info: {
                            ipv4 : ip,
                            mask : subnetmask,
                            gateway : gateway,
                            dns1 : dns,
                            dns2 : dnsbackup
                        }
                    }
                }
            }
        );
        let { errcode } = response;
        if(0 === errcode) {
            let online = detect ();
            if(false === online) {
                this.setState({loading: false});
                // 实力代码：confirm
                confirm({
                    title: '无法连接网络',
                    content: '请检查您的网线是否插好',
                    cancelText: '重新检测',
                    okText: '继续设置',
                    onOk: this.onOk,
                    onCancel: this.onCancel,
                });
            }
        }
        message.error(`参数不合法[${errcode}]`);
        this.setState({loading : false});
    }

    checkDisabled(state){
        const disabled = [ 'ip', 'subnetmask', 'gateway', 'dns' ].some(item => {
            return ('' === state[item] || '' !== state[item + 'Tip']);
        }) && '' !== state.dnsbackupTip;
        return disabled;
    }

    changeType = () => {

    }

    render() {
        const { ip, ipTip, subnetmask, subnetmaskTip, gateway, gatewayTip, dns, dnsTip, dnsbackup,
            dnsbackupTip, loading } = this.state;
        const disabled = this.checkDisabled(this.state);

        return (
            <div>
                <GuideHeader title='手动输入IP（静态IP）' tips='这是说明文字这是说明文字这是说明文字' />
                <form>
                    <Form
                        value={ip}
                        onChange={value => this.onChange('ip', value)}
                        tip={ipTip}
                        placeholder='请输入IP地址'
                        maxLength={15}
                    />
                    <Form
                        value={subnetmask}
                        onChange={value => this.onChange('subnetmask', value)}
                        tip={subnetmaskTip}
                        placeholder='请输入子网掩码'
                        maxLength={15}
                    />
                    <Form
                        value={gateway}
                        onChange={value => this.onChange('gateway', value)}
                        tip={gatewayTip}
                        placeholder='请输入默认网关'
                        maxLength={15}
                    />
                    <Form
                        value={dns}
                        onChange={value => this.onChange('dns', value)}
                        tip={dnsTip}
                        placeholder='请输入首选DNS服务器'
                        maxLength={15}
                    />
                    <Form
                        value={dnsbackup}
                        onChange={value => this.onChange('dnsbackup', value)}
                        tip={dnsbackupTip}
                        placeholder='备选DNS服务器（可选）'
                        maxLength={15}
                    />
                    <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>下一步</Button>
                    <div className='bottom-link'>
                        <Link onClick={this.changeType}>切换上网方式</Link>
                    </div>
                </form>
            </div>
        );
    }
}