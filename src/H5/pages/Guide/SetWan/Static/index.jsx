import React from 'react';
import toast from 'h5/components/toast';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';
import GuideHeader from 'h5/components/GuideHeader';
import Link from 'h5/components/Link';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/confirm';
import { checkIp, checkMask, checkSameNet } from '~/assets/common/check';
import { detect } from '../wan';

const MODULE = 'h5static';

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
                who: intl.get(MODULE, 0)/*_i18n:IP地址*/,
            },
            subnetmask:{
                func: checkMask,
                who: intl.get(MODULE, 1)/*_i18n:子网掩码*/,
            },
            gateway:{
                func: checkIp,
                who: intl.get(MODULE, 2)/*_i18n:默认网关*/,
            },
            dns:{
                func: checkIp,
                who: intl.get(MODULE, 3)/*_i18n:首选DNS*/,
            },
            dnsbackup:{
                func: (value) => {
                    if('' === value.join('.')){
                        return '';
                    }else {
                        return checkIp(value, { who: intl.get(MODULE, 4)/*_i18n:备选DNS*/ });
                    }
                },
                who: intl.get(MODULE, 5)/*_i18n:备选DNS*/,
            },
        }

        let val = value.split('.').map(item => { return item.replace(/\D*/g, ''); });
        let tip = valid[name].func(val, { who: valid[name].who });

        this.setState({
            [name]: val.join('.'),
            [name + 'Tip']: tip
        });
    }

    nextStep = () => {
        this.props.history.push('/guide/setwifi');
    }

    submit = async () => {
        let { ip, subnetmask, gateway, dns, dnsbackup } = this.state;

        this.setState({
            loading: true
        });

        if(ip === gateway){
            toast({tip: intl.get(MODULE, 6)/*_i18n:IP地址与默认网关不能相同*/});
            this.setState({ loading: false });
            return ;
        }

        if(!checkSameNet(ip.split('.'), gateway.split('.'), subnetmask.split('.'))){
            toast({tip: intl.get(MODULE, 7)/*_i18n:IP地址与默认网关需在同一网段*/});
            this.setState({ loading: false });
            return ;
        }

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
        this.setState({
            loading: false
        });

        //检测联网状态
        let { errcode } = response;
        if(0 === errcode) {
            this.setState({
                visible: true
            });
            let online = await detect(this.props);
            this.setState({
                visible: false
            });

            if(false === online) {   //联网失败
                confirm({
                    title: intl.get(MODULE, 8)/*_i18n:无法连接网络*/,
                    content: intl.get(MODULE, 9)/*_i18n:检查您的上网方式是否正确*/,
                    cancelText: intl.get(MODULE, 10)/*_i18n:继续设置*/,
                    okText: intl.get(MODULE, 11)/*_i18n:重新设置*/,
                    onOk: this.onOk,
                    onCancel: this.nextStep,
                });
            } else {
                this.nextStep();
            }
            return;
        }
        toast({tip: intl.get(MODULE, 12, {error: errcode})/*_i18n:参数非法[{error}]*/});
    }

    checkDisabled(state){
        const disabled = [ 'ip', 'subnetmask', 'gateway', 'dns' ].some(item => {
            return ('' === state[item] || '' !== state[item + 'Tip']);
        });
        return disabled || state.dnsbackupTip !== '';
    }

    changeType = () => {
        this.props.history.push('/guide/setwan/static');
    }

    getNetInfo = async ()=>{
        let response = await common.fetchApi({ opcode: 'NETWORK_WAN_IPV4_GET' });
        let { data, errcode } = response;
        if(errcode == 0){
            this.static = data[0].result.wan.static;
            const { ipv4, mask, gateway, dns1, dns2 } = this.static;
            this.setState({
                ip: ipv4,
                subnetmask: mask,
                gateway: gateway,
                dns: dns1,
                dnsbackup: dns2,
            });
        }
    }

    componentDidMount(){
        // 获取网络情况
        this.getNetInfo();
    }

    render() {
        const { visible, ip, ipTip, subnetmask, subnetmaskTip, gateway, gatewayTip, dns, dnsTip, dnsbackup,
            dnsbackupTip, loading } = this.state;
        const disabled = this.checkDisabled(this.state);

        return (
            <div>
                <GuideHeader title={intl.get(MODULE, 13)/*_i18n:手动输入IP（静态IP）*/} tips={intl.get(MODULE, 14)/*_i18n:请输入运营商提供的IP地址、子网掩码、网关、DNS服务器地址*/} />
                <Loading visible={visible} content={intl.get(MODULE, 15)/*_i18n:正在连网，请稍候...*/} />
                <form>
                    <Form
                        value={ip}
                        onChange={value => this.onChange('ip', value)}
                        tip={ipTip}
                        placeholder={intl.get(MODULE, 16)/*_i18n:请输入IP地址*/}
                        maxLength={15}
                    />
                    <Form
                        value={subnetmask}
                        onChange={value => this.onChange('subnetmask', value)}
                        tip={subnetmaskTip}
                        placeholder={intl.get(MODULE, 17)/*_i18n:请输入子网掩码*/}
                        maxLength={15}
                    />
                    <Form
                        value={gateway}
                        onChange={value => this.onChange('gateway', value)}
                        tip={gatewayTip}
                        placeholder={intl.get(MODULE, 18)/*_i18n:请输入默认网关*/}
                        maxLength={15}
                    />
                    <Form
                        value={dns}
                        onChange={value => this.onChange('dns', value)}
                        tip={dnsTip}
                        placeholder={intl.get(MODULE, 19)/*_i18n:请输入首选DNS服务器*/}
                        maxLength={15}
                    />
                    <Form
                        value={dnsbackup}
                        onChange={value => this.onChange('dnsbackup', value)}
                        tip={dnsbackupTip}
                        placeholder={intl.get(MODULE, 20)/*_i18n:备选DNS服务器（可选）*/}
                        maxLength={15}
                    />
                    <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>{intl.get(MODULE, 21)/*_i18n:下一步*/}</Button>
                    <div className='bottom-link'>
                        <Link onClick={this.changeType}>{intl.get(MODULE, 22)/*_i18n:切换上网方式*/}</Link>
                    </div>
                </form>
            </div>
        );
    }
}