import React from 'react';
import { message } from 'antd';
import Form from 'h5/Components/Form';
import Button from 'h5/components/Button';
import GuideHeader from 'h5/components/GuideHeader';
import Link from 'h5/components/Link';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/Confirm';
import { checkIp, checkMask } from '~/assets/common/check';
import { detect } from '../wan';

export default class Static extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        visible: false,
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
        loading: false,
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

    onCancel = () => {
        this.props.history.push('/guide/setwifi');
    }

    submit = async () => {
        const { ip, subnetmask, gateway, dns, dnsbackup } = this.state;
        this.setState({
            loading: true
        });
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
            this.setState({
                loading: false,
                visible: true
            });
            let online = await detect(this.props);
            if(false === online) {
                this.setState({
                    visible: false
                });

                confirm({
                    title: '无法连接网络',
                    content: '检查您的上网方式是否正确',
                    cancelText: '继续设置',
                    okText: '重新设置',
                    onOk: this.onOk,
                    onCancel: this.onCancel,
                });
            }
            return;
        }
        this.setState({
            loading: false
        });
        message.error(`参数非法[${errcode}]`);
    }

    checkDisabled(state){
        const disabled = [ 'ip', 'subnetmask', 'gateway', 'dns' ].some(item => {
            return ('' === state[item] || '' !== state[item + 'Tip']);
        }) && '' !== state.dnsbackupTip;
        return disabled;
    }

    changeType = () => {
        this.props.history.push('/guide/setwan/static');
    }

    render() {
        const { visible, ip, ipTip, subnetmask, subnetmaskTip, gateway, gatewayTip, dns, dnsTip, dnsbackup,
            dnsbackupTip, loading } = this.state;
        const disabled = this.checkDisabled(this.state);

        return (
            <div>
                <GuideHeader title='手动输入IP（静态IP）' tips='请输入运营商提供的 IP地址、子网掩码、网关、DNS服务器地址' />
                <Loading visible={visible} content='正在联网，请稍候...' />
                <form>
                    <Form
                        type='number'
                        value={ip}
                        onChange={value => this.onChange('ip', value)}
                        tip={ipTip}
                        placeholder='请输入IP地址'
                        maxLength={15}
                    />
                    <Form
                        type='number'
                        value={subnetmask}
                        onChange={value => this.onChange('subnetmask', value)}
                        tip={subnetmaskTip}
                        placeholder='请输入子网掩码'
                        maxLength={15}
                    />
                    <Form
                        type='number'
                        value={gateway}
                        onChange={value => this.onChange('gateway', value)}
                        tip={gatewayTip}
                        placeholder='请输入默认网关'
                        maxLength={15}
                    />
                    <Form
                        type='number'
                        value={dns}
                        onChange={value => this.onChange('dns', value)}
                        tip={dnsTip}
                        placeholder='请输入首选DNS服务器'
                        maxLength={15}
                    />
                    <Form
                        type='number'
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