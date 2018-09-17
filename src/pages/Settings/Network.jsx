
import React from 'react';
import { Checkbox, Select ,Radio,Button} from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";

const {FormItem, ErrorTip, Input,InputGroup} = Form;
const Option = Select.Option;
const RadioGroup = Radio.Group;



export default class WIFI extends React.Component {
    state = {
        type : 'pppoe',
        disable : false,
        //pppoe
        pppoeAccount : '123',
        pppoeAccountTip : '',
        pppoePassword : '',
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
            type:value
        })
    }

    onRadioChange = (value,feild) => {
        this.setState({
            [feild]:value
        })
    }
    
    onDhcpRadioChange = event => {
        this.setState({
            dhcpType:event.target.value
        })
    }

    onPppoeRadioChange = event => {
        this.setState({
            pppoeType:event.target.value
        })
    }

    // 校验参数
    checkParams(){
        let { type, pppoeAccount, pppoePassword, staticDns, staticDnsbackup, ip, gateway, subnetmask,pppoeDns, pppoeDnsbackup, dhcpDns, dhcpDnsbackup } = this.state;
        switch(type){
            case 'pppoe' :
                if(pppoeAccount.length === 0 || pppoePassword.length === 0){
                    return false;
                }
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
                empty = [dhcpDns, dhcpDnsbackup].some(field => {
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
        let wan = {}, {type, pppoeAccount, pppoePassword, ip, dns, dnsbackup, gateway, subnetmask} = this.state;
        wan['dial_type'] = type;
        switch(this.state.type){
            case 'pppoe' :
                let { pppoe } = this.netInfo;
                wan['dns_type'] = pppoe.dns_type === "dynamic" ? 'auto' : pppoe.dns_type;
                wan['user_info'] = {
                    username : btoa(pppoeAccount),
                    password : btoa(pppoePassword)
                };
                break;
            case 'static' :
                wan.info = {
                    ipv4 : ip.join('.'),
                    mask : subnetmask.join('.'),
                    gateway : gateway.join('.'),
                    dns1 : dns.join('.'),
                    dns2 : dnsbackup.join('.')
                };
                break;
            case 'dhcp' :
                wan['dns_type'] = this.netInfo.dhcp.dns_type;
                // wan['dns_info'] = [];
                break;
        }
        return { wan };
    }

    //表单提交
    post = async() => {

    }

    render(){
        const {type, pppoeDns, pppoeDnsbackup, dhcpDns, dhcpDnsbackup, staticDns, staticDnsbackup, ip, subnetmask, gateway, dhcpType, pppoeType,pppoeAccount} = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="当前上网信息" checkable={false} checked={true} />
                        <div>
                            <ul className="ui-mute">联网状态:</ul>
                            <label className="oneline">已联网</label>
                        </div>
                        <div>
                            <ul className="ui-mute">上网方式:</ul>
                            <label className="oneline">PPPoE拨号</label>
                        </div>
                        <div>
                            <ul className="ui-mute">IP地址:</ul>
                            <label className="oneline">192.168.2.1</label>
                        </div>
                        <div>
                            <ul className="ui-mute">子网掩码:</ul>
                            <label className="oneline">255.255.255.0</label>
                        </div>
                        <div>
                            <ul className="ui-mute">默认网关:</ul>
                            <label className="oneline">255.255.255.0</label>
                        </div>
                        <div>    
                            <ul className="ui-mute">DNS:</ul>
                            <label className="oneline">255.255.255.0</label>
                        </div>
                    </section>
                    <section className="wifi-setting-item">
                        <PanelHeader title="上网设置" checkable={false} checked={true} />
                        <label>上网方式</label>
                        <Select value={this.state.type} style={{ width: 320, marginBottom: 16}} onChange={this.onTypeChange}>
                            <Option value='pppoe'>宽带账号上网（PPPoE）</Option>
                            <Option value='dhcp'>自动获取IP（DHCP）</Option>
                            <Option value='static'>手动输入IP（静态IP）</Option>
                        </Select>
                        {
        
                            type === 'pppoe' ? <PPPoE pppoeAccount = {pppoeAccount}
                                    pppoePasswrod = {this.state.pppoePasswrod}
                                    handlePasswordChange = {this.handlePasswordChange}
                                    pppoeType={this.state.pppoeType}
                                    onPppoeRadioChange={this.onPppoeRadioChange}
                                    handleAccountChange={this.handleAccountChange}
                                    handlePasswordBlur={this.handlePasswordBlur}

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
                            dns={pppoeDns} onChange={this.onIPConifgChange}/> : ''
                        }
                        {
                            type === 'dhcp' & dhcpType === 'manual' ? <Dns dnsbackup={dhcpDnsbackup}
                            dns={dhcpDns} onChange={this.onIPConifgChange}/> : ''
                        }             
                        {
                            type === 'static' ? <Dns dnsbackup={staticDnsbackup}
                            dns={staticDns} onChange={this.onIPConifgChange}/> : ''
                        }
                        <div className="lan-setting">
                            <div className="save">
                                <Button  style={{ width : 320 }}  size="large" type="primary">保存</Button>
                            </div>
                        </div>
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
            <Input type="text" value={props.pppoeAccount} onChange={props.handleAccountChange}/>
        </FormItem>
        <label>密码</label>
        <FormItem key="pppoepassword" type="small" style={{ width : 320}}>
            <Input type="password" disabled={props.hostSsidPasswordDisabled} onBlur={props.handleAccountBlur} value={props.pppoePassword} onChange={props.handlePasswordChange} />
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
    <div key="dhcp" className="wifi-settings">
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
            <FormItem  style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : props.dns[0], maxLength : 3}, {value : props.dns[1], maxLength : 3}, {value : props.dns[2], maxLength : 3}, {value : props.dns[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, props.dns)} />
            </FormItem>
            <label>备选DNS</label>
            <FormItem style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : props.dnsbackup[0], maxLength : 3}, {value : props.dnsbackup[1], maxLength : 3}, {value : props.dnsbackup[2], maxLength : 3}, {value : props.dnsbackup[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, props.dnsbackup)}
                />
            </FormItem>
        </div>
    ]
}

