import React from 'react';
import { Base64 } from 'js-base64';
import { Select, Button, message } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { checkIp, checkMask, checkSameNet, checkStr } from '~/assets/common/check';
import SubLayout from '~/components/SubLayout';
import Dns from './Dns';
import Static from './Static';
import Dhcp from './Dhcp';
import PPPoE from './PPPoE';

const MODULE = 'network';

const {FormItem, Input } = Form;
const Option = Select.Option;

export default class NetworkTemple extends React.Component {
    constructor(props) {
        super(props);
        this.err = {
            '-1001' : intl.get(MODULE, 0)/*_i18n:参数非法*/ ,
            '-1002' : intl.get(MODULE, 1)/*_i18n:数据值不符合要求*/,
            '-1061' : intl.get(MODULE, 2)/*_i18n:WAN口IP地址与局域网IP地址冲突*/
        }
    }
    state = {
        type : 'static',
        disabled : false,
        onlineStatus : '',
        dialType : '',

        //info
        infoIp : [],
        infoGateway : [],
        infoMask : [],
        infoDns: '',

        //pppoe
        pppoeAccount : '',
        pppoeAccountTip : '',
        pppoePassword : '',
        pppoePasswordTip : '',
        service : '',
        pppoeType: 'auto',
        hostSsidPasswordDisabled : false,
        pppoeDns:["","","",""],
        pppoeDnsbackup:["","","",""],

        //静态IP
        ipv4 : ["","","",""],
        subnetmask : ["","","",""],
        gateway : ["","","",""],
        staticDns : ["","","",""],
        staticDnsbackup : ["","","",""],
        //dhcp
        dhcpType: 'auto',
        dhcpDns: ["","","",""],
        dhcpDnsbackup:["","","",""],

        //防呆提示语
        ipv4Tip : '',
        gatewayTip : '',
        subnetmaskTip : '',
        staticDnsTip : '',
        staticDnsbackupTip : '',
        dhcpDnsTip : '',
        dhcpDnsbackupTip : '',
        pppoeDnsTip : '',
        pppoeDnsbackupTip : '',

        loading: false
    };

    onIPConifgChange = (val, key) => {
        let valid = {
            ipv4:{
                func: checkIp,
                who: intl.get(MODULE, 3)/*_i18n:IP地址*/,
            },
            subnetmask:{
                func: checkMask,
                who: intl.get(MODULE, 4)/*_i18n:子网掩码*/,
            },
            gateway:{
                func: checkIp,
                who: intl.get(MODULE, 5)/*_i18n:默认网关*/,
            },
            staticDns:{
                func: checkIp,
                who: intl.get(MODULE, 6)/*_i18n:首选DNS*/,
            },
            dhcpDns:{
                func: checkIp,
                who: intl.get(MODULE, 6)/*_i18n:首选DNS*/,
            },
            pppoeDns:{
                func: checkIp,
                who: intl.get(MODULE, 6)/*_i18n:首选DNS*/,
            },
            staticDnsbackup:{
                func: checkIp,
                who: intl.get(MODULE, 7)/*_i18n:备选DNS*/,
            },
            dhcpDnsbackup:{
                func: checkIp,
                who: intl.get(MODULE, 7)/*_i18n:备选DNS*/,
            },
            pppoeDnsbackup:{
                func: checkIp,
                who: intl.get(MODULE, 7)/*_i18n:备选DNS*/,
            },
        }
        let tip = valid[key].func(val, {who : valid[key].who});
        if (['staticDnsbackup', 'dhcpDnsbackup', 'pppoeDnsbackup'].some(k => { 
           return k === key && val.every(item => item.length === 0);
        })) {
            tip = '';
        }
        this.setState({
            [key] : (typeof val == 'object' ? [...val] : val),
            [key + 'Tip'] : tip
        },()=>{
            this.setState({disabled : !this.checkParams()});
        })
    }

    handleAccountChange = value => {
        this.setState({ 
            pppoeAccount: value,
            pppoeAccountTip: checkStr( value, { who: intl.get(MODULE, 8)/*_i18n:PPPOE 账号*/, min: 1, max: 64 } )
         }, () => {
            this.setState({
                disabled: !this.checkParams()
            });
        });
    }

    handleHostPassword = () => {
        this.setState({
            hostSsidPasswordDisabled : this.state.hostSsidPasswordDisabled
        });
    }

    handleServiceChange = value => {
        this.setState({
            service : value
        })
    }

    // 处理pppoe 密码框 change
    handlePasswordChange = value => {
        this.setState({ 
            pppoePassword: value,
            pppoePasswordTip: checkStr( value, { who: intl.get(MODULE, 9)/*_i18n:PPPOE 密码*/, min: 1, max: 32, type: 'english'} )
         }, () => {
            this.setState({
                disabled : !this.checkParams()
            });
        });
    };
    
    onTypeChange = value => {
        this.setState({
            type : value,
        },()=>{
            this.setState({
                disabled : !this.checkParams()
            })
        })
    }
    
    onDhcpRadioChange = event => {
        this.setState({
            dhcpType:event.target.value,
        },()=>{
            this.setState({disabled : !this.checkParams()})
        })
    }

    onPppoeRadioChange = event => {
        this.setState({
            pppoeType:event.target.value,
        },()=>{ this.setState({disabled : !this.checkParams()})
        })
    }

    checkbackupDns = value => {
        return value.every(item => {return item.length === 0}) || value.every(item => {return item.length !== 0})
    }

    checkDns = value =>{
        return value.some(f => {
            if(f == null || typeof f === 'undefined' || f === ''){
                return true;
            }
        });
    }

    checkSameDns = (dns1,dns2) => {
        let length1 = dns1.length;
        let length2 = dns2.length;
        if(length1 !== length2){
            return false;
        }
        let i;
        for(i = 0; i < length1 ;i++){
            if(dns1[i] !== dns2[i] ){
                return false;
            }
        }
        return true;
    }

    // 校验参数
    checkParams(){
        let { type, pppoeAccount, pppoeAccountTip, pppoePassword, pppoePasswordTip, pppoeType, dhcpType, staticDns, staticDnsbackup, ipv4, gateway, subnetmask, staticDnsTip, staticDnsbackupTip, ipv4Tip, gatewayTip, subnetmaskTip,
         pppoeDns, pppoeDnsbackup, dhcpDns, dhcpDnsbackup, pppoeDnsTip, pppoeDnsbackupTip, dhcpDnsTip, dhcpDnsbackupTip } =
         this.state;
        switch(type){
            case 'pppoe' :
                if( pppoeAccount.length === 0 || pppoePassword.length === 0 || pppoeAccountTip !== '' || pppoePasswordTip !== ''
                || pppoeDnsTip !=='' || pppoeDnsbackupTip !== '')
                {
                    return false;
                }
                if(pppoeType === 'manual'){
                    if(this.checkSameDns(pppoeDns,pppoeDnsbackup) && pppoeDnsbackup.every(item => {return item.length !== 0})){
                        this.setState({
                            pppoeDnsbackupTip : intl.get(MODULE, 10)/*_i18n:备选DNS不能与首选DNS相同*/
                        });
                        return false;
                    }
                    if (pppoeDns.length === 0 || this.checkDns(pppoeDns) || !this.checkbackupDns(pppoeDnsbackup)){
                        return false
                    };
                }
                break;
            case 'static' :
               let empty = [staticDns, ipv4, subnetmask, gateway].some(field => {
                    if(field.length === 0){
                        return true;
                    }
                    return field.some(f => {
                        if(f == null || typeof f === 'undefined' || f === ''){
                            return true;
                        }
                    });
                });
                let checkTip = [ staticDnsTip, staticDnsbackupTip, ipv4Tip, gatewayTip, subnetmaskTip ].some( field =>{
                    if (field !== ''){
                        return true;
                    }
                });
                if (empty || checkTip){
                    return false;
                }
                if(this.checkSameDns(staticDns,staticDnsbackup) && staticDnsbackup.every(item => {return item.length !== 0})){
                    this.setState({
                        staticDnsbackupTip : intl.get(MODULE, 10)/*_i18n:备选DNS不能与首选DNS相同*/
                    });
                    return false;
                }
                if(!this.checkbackupDns(staticDnsbackup)){
                    return false;
                }
                break;
            case 'dhcp':
                if (dhcpType === 'manual'){
                    if(this.checkSameDns(dhcpDns,dhcpDnsbackup) && dhcpDnsbackup.every(item => {return item.length !== 0})){
                        this.setState({
                            dhcpDnsbackupTip : intl.get(MODULE, 10)/*_i18n:备选DNS不能与首选DNS相同*/
                        });
                        return false;
                    }
                    if(dhcpDns.length == 0 || this.checkDns(dhcpDns) || !this.checkbackupDns(dhcpDnsbackup) || dhcpDnsTip !== ''
                    || dhcpDnsbackupTip !== ''){
                        return false;
                    }
                }

                break;
        }
        return true;
    }

    //表单提交参数
    composeParams(){
        let wan = {}, {type, pppoeAccount, service, pppoePassword, pppoeType, pppoeDns, pppoeDnsbackup, dhcpType, dhcpDns, dhcpDnsbackup, ipv4, staticDns, staticDnsbackup, gateway, subnetmask} = this.state;
        wan['dial_type'] = type;
        switch(type){
            case 'pppoe' :
                wan['dns_type'] = pppoeType;
                wan['user_info'] = {
                    username : Base64.encode(pppoeAccount),
                    password : Base64.encode(pppoePassword)
                };
                if(pppoeType === 'manual'){
                    wan['dns_info'] = {
                        dns1 : pppoeDns.join('.'),
                        dns2 : pppoeDnsbackup.every(item => item.length === 0) ? '' : pppoeDnsbackup.join('.')
                    };
                }
                wan['service'] = service;
                break;
            case 'static' :
                wan['info'] = {
                    ipv4 : ipv4.join('.'),
                    mask : subnetmask.join('.'),
                    gateway : gateway.join('.'),
                    dns1 : staticDns.join('.'),
                    dns2 : staticDnsbackup.every(item => item.length === 0) ? '' : staticDnsbackup.join('.')
                };
                break;
            case 'dhcp' :
                wan['dns_type'] = dhcpType;
                if(dhcpType === 'manual'){
                    wan['dns_info'] = {
                        dns1 : dhcpDns.join('.'),
                        dns2 : dhcpDnsbackup.every(item => item.length === 0) ? '' : dhcpDnsbackup.join('.')
                    };
                }
                break;
        }
        return { wan };
    }

    //表单提交
    post = async() => {
        const { opcodeSet } = this.props;
        this.setState({
            loading : true,
        });
        let payload = this.composeParams(), info = payload.wan.info;
        if(this.state.type === 'static' && info.ipv4 === info.gateway){
            this.setState({
                disabled: false,
                loading: false,
            });
            message.error( intl.get(MODULE, 11)/*_i18n:IP地址与默认网关不能相同*/ );
            return ;
        }
        if(!checkSameNet(this.state.ipv4,this.state.gateway,this.state.subnetmask)){
            this.setState({
                disabled: false,
                loading: false,
            });
            message.error( intl.get(MODULE, 12)/*_i18n:IP地址与默认网关需在同一网段上*/ );
            return ;
        }
        await common.fetchApi(
            {
                opcode : opcodeSet,
                data : payload
            },
            ).then(refs => {
            let { errcode } = refs;
            if (errcode === 0){
                this.setState({ loading: false });
                message.success(intl.get(MODULE, 13)/*_i18n:配置生效*/);
                this.getNetInfo();
                return;
            }
            this.setState({ loading: false });
            message.error(intl.get(MODULE, 14, {error: this.err[errcode] || errcode})/*_i18n:配置失败{error}*/);
        })
    }

    //获取信息
    getNetInfo = async ()=>{
        const { opcodeGet } = this.props;
        let response = await common.fetchApi(
            { opcode : opcodeGet}
        );
        let { data, errcode } = response;
        if(errcode == 0){
            let initIp = (ip) => {  // 'x.x.x.x' / ''
                if (ip.length === 0) {
                    return ['', '', '', '']
                } else {
                    return Object.assign(['', '', '', ''], ip.split('.'));
                }
            };

            const wan = data[0].result.wan;

            this.updateNetStatus(wan);

            let {dhcp, pppoe} = wan;
            let sm = wan.static;
            
            // set default data
            pppoe.dns_info = pppoe.dns_info || {
                dns1: '',
                dns2: '',
            };
            dhcp.dns_info = dhcp.dns_info || {
                dns1: '',
                dns2: '',
            };
            this.setState({
                type : wan.dial_type,
                //static
                ipv4: [...initIp(sm.ipv4)],
                gateway: [...initIp(sm.gateway)],
                subnetmask: [...initIp(sm.mask)],
                staticDns: [...initIp(sm.dns1)],
                staticDnsbackup: [...initIp(sm.dns2)],

                //pppoe
                pppoeAccount: Base64.decode(pppoe.user_info.username),
                pppoePassword: Base64.decode(pppoe.user_info.password),
                pppoeType: pppoe.dns_type,
                pppoeDns: [...initIp(pppoe.dns_info.dns1)],
                pppoeDnsbackup: [...initIp(pppoe.dns_info.dns2)],
                service : pppoe.service,

                dhcpType: dhcp.dns_type,
                dhcpDns: [...initIp(dhcp.dns_info.dns1 || '')],
                dhcpDnsbackup: [...initIp(dhcp.dns_info.dns2 || '')],
            });

            return;
        }
        message.error(intl.get(MODULE, 15, {error: this.err[errcode] || errcode})/*_i18n:信息获取失败{error}*/);
    }

    updateNetStatus = (wan) => {
        const diagType = {
            dhcp: intl.get(MODULE, 16)/*_i18n:自动获取IP（DHCP）*/,
            pppoe: intl.get(MODULE, 17)/*_i18n:宽带拨号上网（PPPoE）*/,
            static: intl.get(MODULE, 18)/*_i18n:手动输入IP（静态IP）*/,
        };

        let info = wan.info,
            type = wan.dial_type;
        let { online, ipv4, gateway, mask, dns1, dns2} = info;
        // dns: ''  '0.0.0.0' 'x.x.x.x'
        let infoDns = [dns1, dns2].filter(val => {
            return (val != '' && val != '0.0.0.0');
        }).join(', ');

        this.setState({
            onlineStatus: online ? intl.get(MODULE, 19)/*_i18n:已联网*/ : intl.get(MODULE, 20)/*_i18n:未联网*/,
            dialType: diagType[type],
            infoIp: ipv4 === "" ? '0.0.0.0' : ipv4,
            infoGateway: gateway === "" ? '0.0.0.0' : gateway,
            infoMask: mask === "" ? '0.0.0.0' : mask,
            infoDns: infoDns,
        });
    }
    //上网信息刷新
    refreshNetStatus = async ()=>{
        const { opcodeGet } = this.props;
        let response = await common.fetchApi({ opcode: opcodeGet}, { ignoreErr: true });
            let {errcode, data} = response;
            if(errcode == 0){
                this.updateNetStatus(data[0].result.wan);
            }
        }

    componentDidMount(){
        //获取网络状况
        this.getNetInfo();
        this.handleTime = setInterval(this.refreshNetStatus, 3000);
        this.stop = false;
    }

    componentWillUnmount(){
        this.stop = true;
        clearInterval(this.handleTime);
    }

    render(){
        const { ipv4Tip,gatewayTip,subnetmaskTip,staticDnsTip, staticDnsbackupTip,
                dhcpDnsTip,dhcpDnsbackupTip,pppoeDnsTip,pppoeDnsbackupTip,
                disabled, loading, type, infoIp ,
                dialType, onlineStatus, infoGateway, infoMask, infoDns,
                pppoeDns, pppoeDnsbackup, dhcpDns, dhcpDnsbackup, staticDns, staticDnsbackup,
                ipv4, subnetmask, gateway, dhcpType, pppoeType,pppoeAccount, pppoeAccountTip, pppoePasswordTip, pppoePassword, service} = this.state;

        const infoList = [
            {
                left: {
                    label: intl.get(MODULE, 22)/*_i18n:联网状态：*/,
                    content: onlineStatus,
                },
                right: {
                    label: intl.get(MODULE, 23)/*_i18n:上网方式：*/,
                    content: dialType,
                },
            },
            {
                left: {
                    label: intl.get(MODULE, 24)/*_i18n:IP地址：*/,
                    content: infoIp,
                },
                right: {
                    label: intl.get(MODULE, 25)/*_i18n:子网掩码：*/,
                    content: infoMask,
                },
            },
            {
                left: {
                    label: intl.get(MODULE, 26)/*_i18n:默认网关：*/,
                    content: infoGateway,
                },
                right: {
                    label: intl.get(MODULE, 49)/*_i18n:DNS：*/,
                    content: infoDns,
                },
            }
        ];
        
        return [
            <SubLayout className="settings">
                <div className="wifi-settings">
                    <Form style={{ width : '100%', marginTop : 0,paddingLeft:0}}>
                        <section className="wifi-setting-item" style={{marginBottom : 48}}>
                            <PanelHeader title={intl.get(MODULE, 21)/*_i18n:当前上网信息*/} checkable={false} checked={true} />
                            {
                                infoList.map(item => (
                                    <div className='network-info'>
                                        <div>
                                            <span className="ui-mute status">{item.left.label}</span>
                                            <span>{item.left.content}</span>
                                        </div>
                                        {
                                            item.right&&<div className='right'>
                                                <span className="ui-mute status">{item.right.label}</span>
                                                <span>{item.right.content}</span>
                                            </div>
                                        }   
                                    </div>
                                ))
                            }
                        </section>
                        <section className="wifi-setting-item">
                            <PanelHeader title={intl.get(MODULE, 27)/*_i18n:上网方式*/} checkable={false} checked={true} />
                            <div style={{ padding: 0, marginTop:28, position: 'relative' }} id="typeArea">
                                <label>{intl.get(MODULE, 28)/*_i18n:上网方式*/}</label>
                                <Select value={type} style={{ width: 320, marginBottom: 24}} onChange={this.onTypeChange} getPopupContainer={() => document.getElementById('typeArea')}>
                                    <Option value='pppoe'>{intl.get(MODULE, 29)/*_i18n:宽带拨号上网（PPPoE）*/}</Option>
                                    <Option value='dhcp'>{intl.get(MODULE, 30)/*_i18n:自动获取IP（DHCP）*/}</Option>
                                    <Option value='static'>{intl.get(MODULE, 31)/*_i18n:手动输入IP（静态IP）*/}</Option>
                                </Select>
                            </div>
                            {
            
                                type === 'pppoe' ? <PPPoE pppoeAccount={pppoeAccount}
                                        pppoeAccountTip={pppoeAccountTip}
                                        pppoePasswordTip={pppoePasswordTip}
                                        pppoePassword={pppoePassword}
                                        service={service}
                                        handlePasswordChange={this.handlePasswordChange}
                                        pppoeType={this.state.pppoeType}
                                        onPppoeRadioChange={this.onPppoeRadioChange}
                                        handleAccountChange={this.handleAccountChange}
                                />: ''
                            }
                            {
                                type === 'pppoe' && pppoeType === 'manual' ? <Dns dnsTip={pppoeDnsTip}
                                dnsbackupTip={pppoeDnsbackupTip} dnsbackup={pppoeDnsbackup}
                                dns={pppoeDns} dnsname='pppoeDns' dnsbackupname='pppoeDnsbackup' onChange={this.onIPConifgChange}/> : ''
                            }
                            {
                                type === 'pppoe' ?  <div><label>{intl.get(MODULE, 32)/*_i18n:服务名(可选)*/}</label>
                                <FormItem key="pppoeservice" type="small" style={{ width : 320}}>
                                    <Input maxLength={64} type="text" value={service} onChange={this.handleServiceChange}/>
                                </FormItem></div> : ''
                            }
                            {   
                                type === 'dhcp' ? <Dhcp onDhcpRadioChange={this.onDhcpRadioChange}
                                        dhcpType={this.state.dhcpType}
                                />: ''
                            }
                            {
                                type === 'static' ? <Static ipv4={ipv4} 
                                                gateway={gateway} 
                                                subnetmask={subnetmask}
                                                onChange={this.onIPConifgChange}
                                                ipv4Tip={ipv4Tip}
                                                gatewayTip={gatewayTip}
                                                subnetmaskTip={subnetmaskTip}
                                                dnsTip={staticDnsTip}
                                                dnsbackupTip={staticDnsbackupTip}
                                                dnsbackup={staticDnsbackup}
                                                dns={staticDns}
                                                dnsname='staticDns'
                                                dnsbackupname='staticDnsbackup'
                                /> : ''
                            } 
                            {
                                type === 'dhcp' && dhcpType === 'manual' ? <Dns dnsTip={dhcpDnsTip}
                                dnsbackupTip={dhcpDnsbackupTip} dnsbackup={dhcpDnsbackup}
                                dns={dhcpDns} dnsname='dhcpDns' dnsbackupname='dhcpDnsbackup' onChange={this.onIPConifgChange}/> : ''
                            }
                        </section>
                    </Form>
                    <section className="save">
                        <Button type="primary" size='large' style={{ width: 200, height: 42 }} disabled={disabled} onClick={this.post} loading={loading}>{intl.get(MODULE, 34)/*_i18n:保存*/}</Button>
                    </section>
                </div>
            </SubLayout>
        ];
    }
};