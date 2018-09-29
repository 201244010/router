
import React from 'react';
import {Select ,Radio,Button, Modal} from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";

const {FormItem, Input,InputGroup} = Form;
const Option = Select.Option;
const RadioGroup = Radio.Group;



export default class NETWORK extends React.Component {
    state = {
        type : 'pppoe',
        disabled : false,
        onlineStatus : '',
        dialType : '',
        loading : false,

        //info
        infoIp : [],
        infoGateway : [],
        infoMask : [],
        infoDns1 : [],
        infoDns2 : [],

        //pppoe
        pppoeAccount : 'eqeq',
        pppoeAccountTip : '',
        pppoePassword : 'eqeq',
        pppoePasswordTip : '',
        pppoeType: 'auto',
        hostSsidPasswordDisabled : false,
        pppoeDns:[],
        pppoeDnsbackup:[],

        //静态IP
        ip : [],
        subnetmask : [],
        gateway : [],
        staticDns : [],
        staticDnsbackup : [],

        //dhcp
        dhcpType: 'auto',
        dhcpDns: [],
        dhcpDnsbackup:[]
    };

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
            disabled : !this.checkParams()
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
        let { type, pppoeAccount, pppoePassword,pppoeType, dhcpType, staticDns, staticDnsbackup, ip, gateway, subnetmask,pppoeDns, pppoeDnsbackup, dhcpDns, dhcpDnsbackup } = this.state;
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
                empty = [staticDns, staticDnsbackup, ip, subnetmask, gateway].some(field => {
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

    //检测地址
    onIPConifgChange = (value, field) => {
        this.setState({ [field] : value }, function() {
            this.setState({
                disabled : !this.checkParams()
            });
        });
    }

    //表单提交参数
    composeParams(){
        let wan = {}, {type, disabled, pppoeAccount, pppoePassword, pppoeType, pppoeDns, pppoeDnsbackup, dhcpType, dhcpDns, dhcpDnsbackup, ip, staticDns, staticDnsbackup, gateway, subnetmask} = this.state;
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
                    ipv4 : ip.join('.'),
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
        this.setState({loading : true});
        let payload = this.composeParams();
        let response = await common.fetchWithCode('NETWORK_WAN_IPV4_SET',{method : 'POST',data : payload})
            .catch(ex => {})
        let {errcode, message } = response;
        if (errcode == 0){
            this.setState({
                loading : flase
            });x
            return;
        }   
        Modal.error({ title : 'WAN口设置失败', content : message});
    }

    //获取信息
    getNetInfo = async ()=>{
        let response = await common.fetchWithCode(
            'NETWORK_WAN_IPV4_GET',
            { method : 'POST'}
        ).catch(ex=>{});
        console.log(response);  
        let { data, errcode, message } = response;
        if(errcode == 0){
            let {dhcp, pppoe} = data[0].result.wan;
            let staticMode = data[0].result.wan.static;
            this.setState({
                type : data[0].result.wan.dial_type,
                dhcpType : dhcp.dns_type,
                pppoeType : pppoe.dns_type,

                //static
                ip : [...staticMode.ipv4.split('.')],
                gateway : [...staticMode.gateway.split('.')],
                subnetmask : [...staticMode.mask.split('.')],
                staticDns : [...staticMode.dns1.split('.')],
                staticDnsbackup : [...staticMode.dns2.split('.')],

                //pppoe
                pppoeAccount : atob(pppoe.user_info.username),
                pppoePassword : atob(pppoe.user_info.password),

            })

            if(this.state.dhcpType == "manual"){
                this.setState({
                    dhcpDns : [...dhcp.dns_info.dns1.split('.')],
                    dhcpDnsbackup : [...dhcp.dns_info.dns2.split('.')]
                })
            }

            if(this.state.pppoeType == "manual"){
                this.setState({
                    pppoeDns : [...pppoe.dns_info.dns1.split('.')],
                    pppoeDnsbackup : [...pppoe.dns_info.dns2.split('.')]
                })
            }
            return;
        }
        Modal.error({ title: '获取 ipv4 信息失败', content: message});
    }
    
    //上网信息刷新
    refreshNetStatus = async ()=>{
        let fetchNetwork = common.fetchWithCode('NETWORK_WAN_IPV4_GET',{method : 'POST'});
        let fetchOnlineStart = common.fetchWithCode('WANWIDGET_ONLINETEST_START',{method : 'POST'});
        let fetchOnlineGet = common.fetchWithCode('WANWIDGET_ONLINETEST_GET',{method : 'POST'});

        Promise.all([fetchNetwork,fetchOnlineStart,fetchOnlineGet]).then(result => {
            let {errcode, data} = result[0];
            if(errcode == 0){
                let info = data[0].result.wan.info;
                this.setState({
                    //info
                    infoIp : info.ipv4 === "" ? '0.0.0.0' : info.ipv4,
                    infoGateway : info.gateway === "" ? '0.0.0.0' : info.gateway,
                    infoMask : info.mask === "" ? '0.0.0.0' : info.mask,
                    infoDns1 : info.dns1 === "" ? '0.0.0.0' : info.dns1,
                    infoDns2 : info.dns2 === "" ? '0.0.0.0' : info.dns2
                })
                
                if(data[0].result.wan.dial_type == "dhcp"){
                    this.setState({
                        dialType : 'DHCP自动获取'
                    })
                }
    
                if(data[0].result.wan.dial_type == "pppoe"){
                    this.setState({
                        dialType : 'PPPoE拨号'
                    })
                }
    
                if(data[0].result.wan.dial_type == "static"){
                    this.setState({
                        dialType : '静态获取'
                    })
                }
            }
            // 触发检测联网状态
            let connectStatus = result[2];
            // 获取联网状态
            let {errcode:code} = connectStatus;
            if(code == 0){
                let onlinetest = connectStatus.data[0].result.onlinetest.online,status = connectStatus.data[0].result.onlinetest.status;
                if(status === "ok"){
                    if(onlinetest === true){
                        this.setState({
                            onlineStatus : '已联网'
                        })
                    }
                    if(onlinetest === false){
                        this.setState({
                            onlineStatus : '未联网'
                        })
                    }
                }
            }
        })
    }

    componentDidMount(){
        //获取网络状况
       this.getNetInfo();
       this.handleTime = setInterval(() => this.refreshNetStatus(),3000);
       this.stop = false;
    }

    componentWillUnmount(){
        this.stop = true;
        clearInterval(this.handleTime);
    }

    render(){
        const {disabled, loading, type, infoIp , dialType, onlineStatus, infoGateway, infoMask, infoDns1, infoDns2, pppoeDns, pppoeDnsbackup, dhcpDns, dhcpDnsbackup, staticDns, staticDnsbackup, ip, subnetmask, gateway, dhcpType, pppoeType,pppoeAccount} = this.state;
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
                            <label className="oneline">{infoDns1}</label>
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
                            type === 'static' ? <Static ip={ip} 
                                            gateway={gateway} 
                                            subnetmask={subnetmask}
                                            onChange={this.onIPConifgChange}
                            /> : ''
                        } 
                        {
                            type === 'pppoe' & pppoeType === 'manual' ? <Dns dnsbackup={pppoeDnsbackup}
                            dns={pppoeDns} dnsname='pppoeDns' dnsbackupname='pppoeDnsbackup' onChange={this.onIPConifgChange}/> : ''
                        }
                        {
                            type === 'dhcp' & dhcpType === 'manual' ? <Dns dnsbackup={dhcpDnsbackup}
                            dns={dhcpDns} dnsname='dhcpDns' dnsbackupname='dhcpDnsbackup' onChange={this.onIPConifgChange}/> : ''
                        }             
                        {
                            type === 'static' ? <Dns dnsbackup={staticDnsbackup}
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
        <FormItem key='ip' style={{ width : 320}}>
            <InputGroup 
                inputs={[{value : props.ip[0], maxLength : 3}, {value : props.ip[1], maxLength : 3}, {value : props.ip[2], maxLength : 3}, {value : props.ip[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'ip')} />
         </FormItem>
        <label>子网掩码</label>
        <FormItem key='subnetmask' style={{ width : 320}}>
            <InputGroup                                                                     
                inputs={[{value : props.subnetmask[0], maxLength : 3}, {value : props.subnetmask[1], maxLength : 3}, {value : props.subnetmask[2], maxLength : 3}, {value : props.subnetmask[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'subnetmask')} />
        </FormItem>
        <label>网关</label>
        <FormItem key='gateway' style={{ width : 320}}>
            <InputGroup 
                inputs={[{value : props.gateway[0], maxLength : 3}, {value : props.gateway[1], maxLength : 3}, {value : props.gateway[2], maxLength : 3}, {value : props.gateway[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'gateway')} />
        </FormItem>
    </div>
    ];
}

const Dns = props => {
    return [
        <div key="dnstype" className="wifi-settings">
            <label>首选DNS</label>
            <FormItem key='dns' style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : props.dns[0], maxLength : 3}, {value : props.dns[1], maxLength : 3}, {value : props.dns[2], maxLength : 3}, {value : props.dns[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, props.dnsname)} />
            </FormItem>
            <label>备选DNS</label>
            <FormItem key='dnsbackup' style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : props.dnsbackup[0], maxLength : 3}, {value : props.dnsbackup[1], maxLength : 3}, {value : props.dnsbackup[2], maxLength : 3}, {value : props.dnsbackup[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, props.dnsbackupname)}
                />
            </FormItem>
        </div>
    ]
}

