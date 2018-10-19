
import React from 'react';
import {Select ,Radio,Button, Modal} from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {checkIp, checkMask} from '~/assets/common/check';

const {FormItem, Input, InputGroup, ErrorTip} = Form;
const Option = Select.Option;
const RadioGroup = Radio.Group;



export default class NETWORK extends React.Component {
    state = {
        type : 'dhcp',
        disabled : false,
        onlineStatus : '',
        dialType : '',
        loading : false,

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
        pppoeDnsbackupTip : ''
    };

    onIPConifgChange = (val, key) => {
        let valid = {
            ipv4:{
                func: checkIp,
                who:'IP地址',
            },
            subnetmask:{
                func: checkMask,
                who:'子网掩码',
            },
            gateway:{
                func: checkIp,
                who:'网关',
            },
            staticDns:{
                func: checkIp,
                who:'首选DNS',
            },
            dhcpDns:{
                func: checkIp,
                who:'首选DNS',
            },
            pppoeDns:{
                func: checkIp,
                who:'首选DNS',
            },
            staticDnsbackup:{
                func: checkIp,
                who:'次选DNS',
            },
            dhcpDnsbackup:{
                func: checkIp,
                who:'次选DNS',
            },
            pppoeDnsbackup:{
                func: checkIp,
                who:'次选DNS',
            },
        }
        let tip = valid[key].func(val, {who : valid[key].who});
        this.setState({
            [key] : (typeof val == 'object' ? [...val] : val),
            [key + 'Tip'] : tip
        },()=>{
            this.setState({disabled : !this.checkParams()});
        })
    }

    handleAccountChange = value => {
        this.setState({ pppoeAccount : value }, function(){
            this.setState({
                disabled : !this.checkParams()
            });
        });
    }

    handleAccountBlur = ()=>{
        if(this.state.pppoeAccount.length === 0 ){
            this.setState({
                pppoeAccountTip : "PPPOE 账号不能为空"
            });
        }
    }

    handleHostPassword = checked => {
        this.setState({
            hostSsidPasswordDisabled : this.state.hostSsidPasswordDisabled
        });
    }

    // 处理pppoe 密码框 change
    handlePasswordChange = value => {
        this.setState({ pppoePassword : value }, function(){
            this.setState({
                disabled : !this.checkParams()
            });
        });
    };

    // pppoe 密码输入框失去焦点
    handlePasswordBlur = ()=>{
        if(this.state.pppoePassword.length === 0 ){
            this.setState({
                pppoePasswordTip : "PPPOE 密码不能为空"
            });
        }
    }
    
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

    // 校验参数
    checkParams(){
        let { type, pppoeAccount, pppoePassword,pppoeType, dhcpType, staticDns, staticDnsbackup, ipv4, gateway, subnetmask,pppoeDns, pppoeDnsbackup, dhcpDns, dhcpDnsbackup } = this.state;
        switch(type){
            case 'pppoe' :
                if(pppoeAccount.length === 0 || pppoePassword.length === 0){
                    return false;
                }
                if(pppoeType === 'manual'){
                    let empty = [pppoeDns, pppoeDnsbackup].some(field => {
                        if(field.length === 0){
                            return true;
                        }
                        return field.some(f => {
                            if(f == null || typeof f === 'undefined' || f === ''){
                                return true;
                            }
                        });
                    })
                    if(empty){

                        return false;
                    } 
                }

                break;
            case 'static' :
               let empty = [staticDns, staticDnsbackup, ipv4, subnetmask, gateway].some(field => {
                    if(field.length === 0){
                        return true;
                    }
                    return field.some(f => {
                        if(f == null || typeof f === 'undefined' || f === ''){
                            return true;
                        }
                    });
                })
                if(empty){
                    return false;
                }            
                break;
            case 'dhcp':
                if (dhcpType === 'manual'){
                    let empty = [dhcpDns, dhcpDnsbackup].some(field => {
                        if(field.length === 0){
                            return true;
                        }
                        return field.some(f => {
                            if(f == null || typeof f === 'undefined' || f === ''){
                                return true;
                            }
                        });
                    })
                    if(empty){
                        return false;
                    }
                }

                break;
        }
        return true;
    }

    //表单提交参数
    composeParams(){
        let wan = {}, {type, pppoeAccount, pppoePassword, pppoeType, pppoeDns, pppoeDnsbackup, dhcpType, dhcpDns, dhcpDnsbackup, ipv4, staticDns, staticDnsbackup, gateway, subnetmask} = this.state;
        wan['dial_type'] = type;
        switch(type){
            case 'pppoe' :
                wan['dns_type'] = pppoeType,
                wan['user_info'] = {
                    username : btoa(pppoeAccount),
                    password : btoa(pppoePassword)
                };
                wan['dns_info'] = {
                    dns1 : pppoeDns.join('.'),
                    dns2 : pppoeDnsbackup.join('.')
                };
                break;
            case 'static' :
                wan['info'] = {
                    ipv4 : ipv4.join('.'),
                    mask : subnetmask.join('.'),
                    gateway : gateway.join('.'),
                    dns1 : staticDns.join('.'),
                    dns2 : staticDnsbackup.join('.')
                };
                break;
            case 'dhcp' :
                wan['dns_type'] = dhcpType,
                wan['dns_info'] = {
                    dns1 : dhcpDns.join('.'),
                    dns2 : dhcpDnsbackup.join('.')
                };
                break;
        }
        return { wan };
    }

    //表单提交
    post = async() => {
        this.setState({
            loading : true,
            disabled : true,
        });
        let payload = this.composeParams(), info = payload.wan.info;
        if(this.state.type === 'static' && info.ipv4 === info.gateway){
            this.setState({
                disabled : false,
                loading : false
            });
            return Modal.error({ title : '参数校验失败', content :  'IPV4不能跟网关相同' });
        }
        let response = await common.fetchApi({
            opcode : 'NETWORK_WAN_IPV4_SET',
            data : payload
        })
        let {errcode, message } = response;
        if (errcode == 0){
            this.setState({
                loading : false,
                disabled : false
            });
            return;
        }   
        Modal.error({ title : 'WAN口设置失败', content : message});
    }

    //获取信息
    getNetInfo = async ()=>{
        let response = await common.fetchApi(
            { opcode : 'NETWORK_WAN_IPV4_GET'}
        );
        let { data, errcode, message } = response;
        if(errcode == 0){
            let initIp = (ip) => {  // 'x.x.x.x' / ''
                return Object.assign(['', '', '', ''], ip.split('.'));
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
                pppoeAccount: atob(pppoe.user_info.username),
                pppoePassword: atob(pppoe.user_info.password),
                pppoeType: pppoe.dns_type,
                pppoeDns: [...initIp(pppoe.dns_info.dns1)],
                pppoeDnsbackup: [...initIp(pppoe.dns_info.dns2)],

                dhcpType: dhcp.dns_type,
                dhcpDns: [...initIp(dhcp.dns_info.dns1 || '')],
                dhcpDnsbackup: [...initIp(dhcp.dns_info.dns2 || '')],
            });

            return;
        }
        Modal.error({ title: '获取上网设置信息失败', content: message});
    }

    updateNetStatus = (wan) => {
        const diagType = {
            dhcp: 'DHCP自动获取',
            pppoe: 'PPPoE拨号',
            static: '静态获取',
        };

        let info = wan.info,
            type = wan.dial_type;
        let { online, ipv4, gateway, mask, dns1, dns2} = info;
        // dns: ''  '0.0.0.0' 'x.x.x.x'
        let infoDns = [dns1, dns2].filter(val => {
            return (val != '' && val != '0.0.0.0');
        }).join(', ');

        this.setState({
            onlineStatus: online ? '已联网' : '未联网',
            dialType: diagType[type],
            infoIp: ipv4 === "" ? '0.0.0.0' : ipv4,
            infoGateway: gateway === "" ? '0.0.0.0' : gateway,
            infoMask: mask === "" ? '0.0.0.0' : mask,
            infoDns: infoDns,
        });
    }
    //上网信息刷新
    refreshNetStatus = async ()=>{
        let response = await  common.fetchApi({
                opcode : 'NETWORK_WAN_IPV4_GET'
            })
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
                ipv4, subnetmask, gateway, dhcpType, pppoeType,pppoeAccount} = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0,paddingLeft:0}}>
                    <section className="wifi-setting-item" style={{marginBottom : 0}}>
                        <PanelHeader title="当前上网信息" checkable={false} checked={true} />
                        <div style={{height :　34}}>
                            <ul className="ui-mute">联网状态:</ul>
                            <label className="oneline">{onlineStatus}</label>
                        </div>
                        <div style={{height :　34}}>
                            <ul className="ui-mute">上网方式:</ul>
                            <label className="oneline">{dialType}</label>
                        </div>
                        <div style={{height :　34}}>
                            <ul className="ui-mute">IP地址:</ul>
                            <label className="oneline">{infoIp}</label>
                        </div>
                        <div style={{height :　34}}>
                            <ul className="ui-mute">子网掩码:</ul>
                            <label className="oneline">{infoMask}</label>
                        </div>
                        <div style={{height :　34}}>
                            <ul className="ui-mute">默认网关:</ul>
                            <label className="oneline">{infoGateway}</label>
                        </div>
                        <div style={{height :　34}}>    
                            <ul className="ui-mute">DNS:</ul>
                            <label className="oneline">{infoDns}</label>
                        </div>
                    </section>
                    <section className="wifi-setting-item">
                        <PanelHeader title="上网设置" checkable={false} checked={true} />
                        <label>上网方式</label>
                        <Select value={type} style={{ width: 320, marginBottom: 16}} onChange={this.onTypeChange}>
                            <Option value='pppoe'>宽带账号上网（PPPoE）</Option>
                            <Option value='dhcp'>自动获取IP（DHCP）</Option>
                            <Option value='static'>手动输入IP（静态IP）</Option>
                        </Select>
                        {
        
                            type === 'pppoe' ? <PPPoE pppoeAccount={pppoeAccount}
                                    pppoePassword={this.state.pppoePassword}
                                    handlePasswordChange={this.handlePasswordChange}
                                    pppoeType={this.state.pppoeType}
                                    onPppoeRadioChange={this.onPppoeRadioChange}
                                    handleAccountChange={this.handleAccountChange}
                                    handlePasswordBlur={this.handlePasswordBlur}
                                    handleAccountBlur={this.handleAccountBlur}
                            />: ''
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

                            /> : ''
                        } 
                        {
                            type === 'pppoe' && pppoeType === 'manual' ? <Dns dnsTip={pppoeDnsTip}
                            dnsbackupTip={pppoeDnsbackupTip} dnsbackup={pppoeDnsbackup}
                            dns={pppoeDns} dnsname='pppoeDns' dnsbackupname='pppoeDnsbackup' onChange={this.onIPConifgChange}/> : ''
                        }
                        {
                            type === 'dhcp' && dhcpType === 'manual' ? <Dns dnsTip={dhcpDnsTip}
                            dnsbackupTip={dhcpDnsbackupTip} dnsbackup={dhcpDnsbackup}
                            dns={dhcpDns} dnsname='dhcpDns' dnsbackupname='dhcpDnsbackup' onChange={this.onIPConifgChange}/> : ''
                        }             
                        {
                            type === 'static' ? <Dns dnsTip={staticDnsTip}
                            dnsbackupTip={staticDnsbackupTip} dnsbackup={staticDnsbackup}
                            dns={staticDns} dnsname='staticDns' dnsbackupname='staticDnsbackup' onChange={this.onIPConifgChange}/> : ''
                        }
                    </section>
                    <section className="wifi-setting-save">
                            <Button className="wifi-setting-button" type="primary" disabled={disabled} onClick={this.post} loading={loading}>保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
};

const PPPoE = props => {
    return [
    <div key="pppoe" className="wifi-settings">
        <label>账号</label>
        <FormItem key="pppoessid" type="small" style={{ width : 320}}>
            <Input type="text" value={props.pppoeAccount} onChange={props.handleAccountChange} onBlur={props.handleAccountBlur}/>
        </FormItem>
        <label>密码</label>
        <FormItem key="pppoepassword" type="small" style={{ width : 320}}>
            <Input type="password" disabled={props.hostSsidPasswordDisabled} onBlur={props.handlePasswordBlur} value={props.pppoePassword} onChange={props.handlePasswordChange} />
        </FormItem>
        <label>DNS配置</label>
        <RadioGroup key="pppoedns" className="radio" onChange={props.onPppoeRadioChange} value={props.pppoeType}>
            <Radio className="label-in" value='auto'>自动设置</Radio>
            <Radio className="label-in" value='manual'>手动设置</Radio>
        </RadioGroup>
    </div>
    ]; 
}

const Dhcp = props => {
    return [
        <div key="dhcp" className="wifi-settings">
            <label>DNS配置</label>
            <RadioGroup key="dhcpdns" className="radio" onChange={props.onDhcpRadioChange} value={props.dhcpType}>
                <Radio className="label-in" value='auto'>自动设置</Radio>
                <Radio className="label-in" value='manual'>手动设置</Radio>
            </RadioGroup>
        </div>
    ];
}

const Static = props => {
    return [
        <div key="static" className="wifi-settings">
            <label>IP地址</label>
            <FormItem key='ipv4' showErrorTip={props.ipv4Tip} style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : props.ipv4[0], maxLength : 3}, {value : props.ipv4[1], maxLength : 3}, {value : props.ipv4[2], maxLength : 3}, {value : props.ipv4[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, 'ipv4')} />
                <ErrorTip>{props.ipv4Tip}</ErrorTip>
                </FormItem>
            <label>子网掩码</label>
            <FormItem key='subnetmask' showErrorTip={props.subnetmaskTip} style={{ width : 320}}>
                <InputGroup                                                                     
                    inputs={[{value : props.subnetmask[0], maxLength : 3}, {value : props.subnetmask[1], maxLength : 3}, {value : props.subnetmask[2], maxLength : 3}, {value : props.subnetmask[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, 'subnetmask')} />
                <ErrorTip>{props.subnetmaskTip}</ErrorTip>
            </FormItem>
            <label>网关</label>
            <FormItem key='gateway' showErrorTip={props.gatewayTip} style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : props.gateway[0], maxLength : 3}, {value : props.gateway[1], maxLength : 3}, {value : props.gateway[2], maxLength : 3}, {value : props.gateway[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, 'gateway')} />
                <ErrorTip>{props.gatewayTip}</ErrorTip>
            </FormItem>
        </div>
        ];
}


class Dns extends React.Component  {
    constructor(props){
        super(props)
    }

    render (){
        const props = this.props;
        return (
            <div className="wifi-settings">
                <label>首选DNS</label>
                <FormItem key={props.dnsname} showErrorTip={props.dnsTip} style={{ width : 320}}>
                    <InputGroup
                        inputs={[{value : props.dns[0], maxLength : 3}, {value : props.dns[1], maxLength : 3}, {value : props.dns[2], maxLength : 3}, {value : props.dns[3], maxLength : 3}]} 
                        onChange={value => props.onChange(value, props.dnsname)} />
                    <ErrorTip>{props.dnsTip}</ErrorTip>
                </FormItem>
                <label>备选DNS</label>
                <FormItem key={props.dnsbackupname} showErrorTip={props.dnsbackupTip} style={{ width : 320}}>
                    <InputGroup
                        inputs={[{value : props.dnsbackup[0], maxLength : 3}, {value : props.dnsbackup[1], maxLength : 3}, {value : props.dnsbackup[2], maxLength : 3}, {value : props.dnsbackup[3], maxLength : 3}]} 
                        onChange={value => props.onChange(value, props.dnsbackupname)}
                    />
                    <ErrorTip>{props.dnsbackupTip}</ErrorTip>
                </FormItem>
            </div>
        )
    }
}

