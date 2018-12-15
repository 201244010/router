import React from 'react';
import Form from 'h5/Components/Form';
import Button from 'h5/components/Button';
import GuideHeader from 'h5/components/GuideHeader';
import { checkIp, checkMask } from '~/assets/common/check';


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
        disabled: true
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
                func: checkIp,
                who:'备选DNS',
            },
        }

        let tip = valid[name].func(value, { who: valid[name].who });

        if('dnsbackup' === name && '' === value){
            tip = '';
        }

        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        }, () => {
            const disabled = [ 'ip', 'subnetmask', 'gateway', 'dns' ].some(item => {
                return (this.state[item] === '' || this.state[item + 'Tip'] !== '');
            }) && this.state.dnsbackupTip !== '';
            this.setState({
                disabled: disabled
            })
        });
    }

    submit = async () => {
        this.setState({ loading : true });
        const { ip, subnetmask, gateway, dns, dnsbackup } = this.state;
        let response = await common.fetchApi(
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
        if(errcode == 0){
            // 触发检测联网状态
            common.fetchApi(
                [
                    {opcode: 'WANWIDGET_ONLINETEST_START'}
                ]
            ).then( async() =>{
                // 获取联网状态
                let connectStatus = await common.fetchApi(
                    [
                        {opcode: 'WANWIDGET_ONLINETEST_GET'}
                    ],
                    {},
                    {
                        loop : true,
                        interval : 3000,
                        stop : ()=> this.stop,
                        pending : resp => resp.data[0].result.onlinetest.status !== 'ok'
                    }
                );
                let { errcode, data } = connectStatus;
                this.setState({ loading : false });
                if(errcode == 0){
                    let online = data[0].result.onlinetest.online;
                    this.setState({
                        showNetWorkStatus : true,
                        online :online
                    });
                    if(online){
                        setTimeout(() => { this.props.history.push("/guide/speed") }, 3000);
                    }
                    return;
                }
            });
        }else{
            message.error(`参数不合法[${errcode}]`);
            this.setState({loading : false});
        }
    }

    render() {
        const { ip, ipTip, subnetmask, subnetmaskTip, gateway, gatewayTip, dns, dnsTip, dnsbackup,
            dnsbackupTip, loading, disabled } = this.state;

        return (
            <div>
                <GuideHeader title='手动输入IP（静态IP）' tips='这是说明文字这是说明文字这是说明文字' />
                <Form
                    value={ip}
                    onChange={value => this.onChange('ip', value)}
                    tip={ipTip}
                    placeholder='请输入IP地址'
                    maxLength={15} />
                <Form
                    value={subnetmask}
                    onChange={value => this.onChange('subnetmask', value)}
                    tip={subnetmaskTip}
                    placeholder='请输入子网掩码'
                    maxLength={15} />
                <Form
                    value={gateway}
                    onChange={value => this.onChange('gateway', value)}
                    tip={gatewayTip}
                    placeholder='请输入默认网关'
                    maxLength={15} />
                <Form
                    value={dns}
                    onChange={value => this.onChange('dns', value)}
                    tip={dnsTip}
                    placeholder='请输入首选DNS服务器'
                    maxLength={15} />
                <Form
                    value={dnsbackup}
                    onChange={value => this.onChange('dnsbackup', value)}
                    tip={dnsbackupTip}
                    placeholder='备选DNS服务器（可选）'
                    maxLength={15} />
                <div style={{ textAlign: "center"}}>
                    <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>下一步</Button>
                    <a href='javascript:;' onClick={this.changeType}>切换上网方式</a>
                </div>
            </div>
        );
    }
}