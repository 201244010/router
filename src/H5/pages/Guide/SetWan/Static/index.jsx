import React from 'react';
import toast from 'h5/components/toast';
import Input from 'h5/components/Input';
import Button from 'h5/components/Button';
import GuideHeader from 'h5/components/GuideHeader';
import Link from 'h5/components/Link';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/confirm';
import { checkIp, checkMask, checkSameNet } from '~/assets/common/check';
import { detect } from '../wan';
import InputGroup from 'h5/components/InputGroup';

const MODULE = 'h5static';

export default class Static extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        visible: false,
        ip: ['','','',''],
        ipTip: '',
        subnetmask: ['','','',''],
        subnetmaskTip: '',
        gateway: ['','','',''],
        gatewayTip: '', 
        dns: ['','','',''],
        dnsTip: '',
        dnsbackup: ['','','',''],
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
                    if('...' === value.join('.')){
                        return '';
                    }else {
                        return checkIp(value, { who: intl.get(MODULE, 4)/*_i18n:备选DNS*/ });
                    }
                },
                who: intl.get(MODULE, 5)/*_i18n:备选DNS*/,
            },
        }
        let tip = valid[name].func(value, { who: valid[name].who });

        this.setState({
            // [name]: val.join('.'),
            [name]: value,
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

        if(ip.join('.') === gateway.join('.')){
            toast({tip: intl.get(MODULE, 6)/*_i18n:IP地址与默认网关不能相同*/});
            this.setState({ loading: false });
            return ;
        }

        if(!checkSameNet(ip, gateway, subnetmask)){
            toast({tip: intl.get(MODULE, 7)/*_i18n:IP地址与默认网关需在同一网段*/});
            this.setState({ loading: false });
            return ;
        }
        
        let ipv4 = ip.join('.');
        let mask = subnetmask.join('.');
        let gate = gateway.join('.');
        let dns1 = dns.join('.');
        let dns2 = dnsbackup.join('.');

        let response = await common.fetchApi(
            {
                opcode: 'NETWORK_WAN_IPV4_SET',
                data:{
                    wan:{
                        dial_type: 'static',
                        info: {
                            ipv4 : ipv4,
                            mask : mask,
                            gateway : gate,
                            dns1 : dns1,
                            dns2 : dns2
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
            let block = state[item].every(item => {return '' === item});
            return ( block || '' !== state[item + 'Tip']);
        });
        return disabled || state.dnsbackupTip !== '';
    }

    getNetInfo = async ()=>{
        let response = await common.fetchApi({ opcode: 'NETWORK_WAN_IPV4_GET' });
        let { data, errcode } = response;
        if(errcode == 0){
            this.static = data[0].result.wan.static;
            let { ipv4, mask, gateway, dns1, dns2 } = this.static;
            ipv4 = ipv4.split('.');
            mask = mask.split('.');
            gateway = gateway.split('.');
            dns1 = dns1.split('.');
            dns2 = dns2.split('.');

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

        return ([
            <div style={{height: "14.5866rem",padding: "0 0.25rem",marginBottom: 0,overflow: "auto"}}>
                <GuideHeader title={intl.get(MODULE, 13)/*_i18n:手动输入IP（静态IP）*/} tips={intl.get(MODULE, 14)/*_i18n:请输入运营商提供的IP地址、子网掩码、网关、DNS服务器地址*/} />
                <Loading visible={visible} content={intl.get(MODULE, 15)/*_i18n:正在连网，请稍候...*/} />
                <div style={{marginTop: '0.5867rem'}}>
                    <InputGroup
                        inputGroupName='IP'
                        tip={ipTip}
                        inputs={[{value : ip[0], maxLength : 3}, {value : ip[1], maxLength : 3}, {value : ip[2], maxLength : 3}, {value : ip[3], maxLength : 3}]}
                        onChange={value => this.onChange('ip', value)}
                    />
                    <InputGroup
                        inputGroupName={intl.get(MODULE, 1)}
                        tip={subnetmaskTip}
                        inputs={[{value : subnetmask[0], maxLength : 3}, {value : subnetmask[1], maxLength : 3}, {value : subnetmask[2], maxLength : 3}, {value : subnetmask[3], maxLength : 3}]}
                        onChange={value => this.onChange('subnetmask', value)}
                    />
                    <InputGroup
                        inputGroupName={intl.get(MODULE, 2)}
                        tip={gatewayTip}
                        inputs={[{value : gateway[0], maxLength : 3}, {value : gateway[1], maxLength : 3}, {value : gateway[2], maxLength : 3}, {value : gateway[3], maxLength : 3}]}
                        onChange={value => this.onChange('gateway', value)}
                    />
                    <InputGroup
                        inputGroupName={intl.get(MODULE, 3)}
                        tip={dnsTip}
                        inputs={[{value : dns[0], maxLength : 3}, {value : dns[1], maxLength : 3}, {value : dns[2], maxLength : 3}, {value : dns[3], maxLength : 3}]}
                        onChange={value => this.onChange('dns', value)}
                    />
                    <InputGroup
                        inputGroupName={intl.get(MODULE, 23)}
                        tip={dnsbackupTip}
                        inputs={[{value : dnsbackup[0], maxLength : 3}, {value : dnsbackup[1], maxLength : 3}, {value : dnsbackup[2], maxLength : 3}, {value : dnsbackup[3], maxLength : 3}]}
                        onChange={value => this.onChange('dnsbackup', value)}
                    />
                </div>
            </div>,
            <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>{intl.get(MODULE, 21)/*_i18n:下一步*/}</Button>
        ]);
    }
}