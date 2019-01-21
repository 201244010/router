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

const MODULE = 'static';

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
                who: intl.get(MODULE, 0),
            },
            subnetmask:{
                func: checkMask,
                who: intl.get(MODULE, 1),
            },
            gateway:{
                func: checkIp,
                who: intl.get(MODULE, 2),
            },
            dns:{
                func: checkIp,
                who: intl.get(MODULE, 3),
            },
            dnsbackup:{
                func: (value) => {
                    if('' === value.join('.')){
                        return '';
                    }else {
                        return checkIp(value, { who: intl.get(MODULE, 4) });
                    }
                },
                who: intl.get(MODULE, 5),
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
            toast({tip: intl.get(MODULE, 6)});
            this.setState({ loading: false });
            return ;
        }

        if(!checkSameNet(ip.split('.'), gateway.split('.'), subnetmask.split('.'))){
            toast({tip: intl.get(MODULE, 7)});
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
                    title: intl.get(MODULE, 8),
                    content: intl.get(MODULE, 9),
                    cancelText: intl.get(MODULE, 10),
                    okText: intl.get(MODULE, 11),
                    onOk: this.onOk,
                    onCancel: this.nextStep,
                });
            } else {
                this.nextStep();
            }
            return;
        }
        toast({tip: intl.get(MODULE, 12, {error: errcode})});
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
                <GuideHeader title={intl.get(MODULE, 13)} tips={intl.get(MODULE, 14)} />
                <Loading visible={visible} content={intl.get(MODULE, 15)} />
                <form>
                    <Form
                        value={ip}
                        onChange={value => this.onChange('ip', value)}
                        tip={ipTip}
                        placeholder={intl.get(MODULE, 16)}
                        maxLength={15}
                    />
                    <Form
                        value={subnetmask}
                        onChange={value => this.onChange('subnetmask', value)}
                        tip={subnetmaskTip}
                        placeholder={intl.get(MODULE, 17)}
                        maxLength={15}
                    />
                    <Form
                        value={gateway}
                        onChange={value => this.onChange('gateway', value)}
                        tip={gatewayTip}
                        placeholder={intl.get(MODULE, 18)}
                        maxLength={15}
                    />
                    <Form
                        value={dns}
                        onChange={value => this.onChange('dns', value)}
                        tip={dnsTip}
                        placeholder={intl.get(MODULE, 19)}
                        maxLength={15}
                    />
                    <Form
                        value={dnsbackup}
                        onChange={value => this.onChange('dnsbackup', value)}
                        tip={dnsbackupTip}
                        placeholder={intl.get(MODULE, 20)}
                        maxLength={15}
                    />
                    <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>{intl.get(MODULE, 21)}</Button>
                    <div className='bottom-link'>
                        <Link onClick={this.changeType}>{intl.get(MODULE, 22)}</Link>
                    </div>
                </form>
            </div>
        );
    }
}