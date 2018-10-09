import React from 'react';
import { Modal, Icon } from 'antd';
import classnames from 'classnames';
import Form from '~/components/Form';
import { Select, Button } from "antd";
import CustomIcon from '~/components/Icon';

const { FormItem, Input : FormInput, InputGroup  } = Form;
const Option = Select.Option;


export default class SetWan extends React.PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        detect : true,
        type : 'pppoe', // pppoe | dhcp | static
        showNetWorkStatus : false,
        wanLinkState: true,

        // pppoe
        pppoeAccount : '',
        pppoeAccountTip : '',
        pppoePassword : '',
        pppoePasswordTip : '',
        disabled : true,
        loading : false,

        // 静态 ip
        ip : [],
        subnetmask : [],
        gateway : [],
        dns : [],
        dnsbackup : []
    };

    handleChange = value => {
        this.setState({ type : value }, function(){
            if(this.state.type === 'dhcp'){
                return this.setState({
                    disabled : false
                });
            }
            this.setState({
                disabled : !this.checkParams()
            });
        });
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

    componentWillUnmount(){
        this.stop = true;
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

    // 提交表单
    submit = async () => {
        let payload = this.composeParams(), info = payload.wan.info;
        if(this.state.type === 'static' && info.ipv4 === info.gateway){
            return Modal.error({ title : '参数校验失败', content :  'IPV4不能跟网关相同' });
        }
        this.setState({ loading : true });
        let response = await common.fetchWithCode('NETWORK_WAN_IPV4_SET', { method : 'POST', data  : payload })
            .catch(ex => {})
        let {errcode, message } = response;
        if(errcode == 0){
            // 触发检测联网状态
            common.fetchWithCode('WANWIDGET_ONLINETEST_START', {method : 'POST'});
            // 获取联网状态
            let connectStatus = await common.fetchWithCode(
                'WANWIDGET_ONLINETEST_GET', 
                {method : 'POST'},
                {loop : true, interval : 3000, stop : ()=> this.stop, pending : resp => resp.data[0].result.onlinetest.status !== 'ok'}
            );
            let { errcode:code, data } = connectStatus;
            this.setState({ loading : false });
            if(code == 0){
                let online = data[0].result.onlinetest.online;
                this.setState({
                    showNetWorkStatus : true,
                    online
                });
                if(online){
                    // this.props.history.push("/guide/speed");
                    setTimeout(() => { this.props.history.push("/guide/speed") }, 300);
                }
                return;
            }
            return;
        }
        Modal.error({ title : 'WAN口设置失败', content :  message == "ERRCODE_PARAM_VALUE_INVALID" ? "wan口的设置参数不合法" : "" ,onOk:()=>{this.setState({loading : false})}});
        
    }

    // 校验参数
    checkParams(){
        let { type, pppoeAccount, pppoePassword, dns, ip, dnsbackup, gateway, subnetmask } = this.state;
        switch(type){
            case 'pppoe' :
                if(pppoeAccount.length === 0 || pppoePassword.length === 0){
                    return false;
                }
                break;
            case 'static' :
                let empty = [dns, ip, dnsbackup, subnetmask, gateway].some(field => {
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
    
    dialDetect = async () => {
        this.setState({detect:true});
        common.fetchWithCode('WANWIDGET_WAN_LINKSTATE_GET', {method : 'POST'}).then((resp) => {
            const {errcode,data} = resp;
            this.setState({detect : false});
            if(errcode == 0){
                this.setState({wanLinkState : data[0].result.wan_linkstate.linkstate});
            }else{
                Modal.error({title :'获取网线插拔状态失败'});
            } 
            common.fetchWithCode('WANWIDGET_DIALDETECT_START', {method : 'POST'});
            common.fetchWithCode(
            'WANWIDGET_DIALDETECT_GET', 
                { method : 'POST' },
                { 
                    loop : true, 
                    interval : 2000,
                    pending : res => res.data[0].result.dialdetect.status === 'detecting', 
                    stop : () => this.stop
                }
            ).then((response)=>{
               
                const { errcode, data, message } = response;
                if(errcode == 0){
                    let { dialdetect } = data[0].result;
                    let { dial_type } = dialdetect;
                        dial_type  = dial_type === 'none' ? 'pppoe' : dial_type;
                        this.setState({ 
                        type :  dial_type, 
                        disabled : dial_type == 'dhcp' ? false : true 
                        });
                        return;
                }else{
                    Modal.error({ title: '上网方式检查', content: message });
                }
            });        
        });
    }

    getNetInfo = async ()=>{
        let response = await common.fetchWithCode(
            'NETWORK_WAN_IPV4_GET',
            { method : 'POST' },
            { loop : true, pending : res => res.data[0].result.dialdetect === 'detecting', stop : ()=> this.stop }
        ).catch(ex=>{});
        let { data, errcode, message } = response;
        if(errcode == 0){
            this.netInfo = data[0].result.wan;
            console.log('[GOT] IPV4: ', this.netInfo);
            return;
        }
        Modal.error({ title: '获取 ipv4 信息失败', content: message });
    }

    componentDidMount(){
        // 检测上网方式
        this.dialDetect();
        // 获取网络情况
        this.getNetInfo(); 
    }

    onIPConifgChange = (value, field) => {
        this.setState({ [field] : value }, function() {
            this.setState({
                disabled : !this.checkParams()
            });
        });
    }

    nextStep = () => {
        this.setState({ detect : false});
        this.props.history.push("/guide/setwifi");
    }

    reSet = ()=>{
        this.setState({
            showNetWorkStatus : false
        });
    }
    OnwanLinkState = () =>{
        this.setState({
            wanLinkState:true
        })
    }
    
    render(){
        const { detect, online, type, disabled, loading, showNetWorkStatus, ip, gateway, dns, dnsbackup, subnetmask,wanLinkState} = this.state;
        return (
            <div className="set-wan">
                <h2>设置上网参数</h2> 
                <p className="ui-tips guide-tip">上网参数设置完成后，即可连接网络 </p>
                {/* 网络嗅探 SPIN */}
                <div className={classnames(["ui-center speed-test", {'none' : !detect}])}>
                    <Icon key="progress-icon" type="loading" style={{ fontSize: 80, marginBottom : 30, color : "#FB8632" }}  spin />,
                    <h3 key="active-h3">正在检查上网方式，请稍后...</h3>
                </div>
                {/* 显示网络连接状态 */}
                {
                    !wanLinkState?
                        (<div className={classnames(["ui-center speed-test",{'none' : detect}])}> <LinkState dialDetect={this.dialDetect} OnwanLinkState={this.OnwanLinkState} /></div>)
                        :
                        showNetWorkStatus ? 
                        (<div className={classnames(["ui-center speed-test"])}>
                            <NetStatus online={online} reSet={this.reSet} nextStep={this.nextStep} />
                        </div>) :
                    (
                        <div className={classnames(['wan', {'block' : !detect}])}>
                            <Form style={{ margin : '0 auto' }}>
                                <FormItem label="上网方式">
                                    <Select value={type} style={{ width: "100%" }} onChange={this.handleChange}>
                                        <Option value="pppoe">宽带账号上网（PPPoE）</Option>
                                        <Option value="dhcp">自动获取IP（DHCP）</Option>
                                        <Option value="static">手动输入IP（静态IP）</Option>
                                    </Select>
                                </FormItem>
                                {/* pppoe 输入组件 */}
                                {
                                    type === 'pppoe' ? <PPPOE 
                                        pppoeAccount={this.state.pppoeAccount} 
                                        pppoeAccountTip={this.state.pppoeAccountTip}
                                        pppoePassword={this.state.pppoePassword}
                                        pppoePasswordTip={this.state.pppoePasswordTip}
                                        handleAccountBlur={this.handleAccountBlur}
                                        handleAccountChange={this.handleAccountChange} 
                                        handlePasswordChange={this.handlePasswordChange}
                                        handlePasswordBlur={this.handlePasswordBlur} />  : ''
                                }
                                {/* 静态 ip 输入组件 */}
                                {
                                    type === 'static' ? <StaticIp ip={ip} 
                                                                    dns={dns} 
                                                                    gateway={gateway} 
                                                                    subnetmask={subnetmask}
                                                                    dnsbackup={dnsbackup} 
                                                                    onChange={this.onIPConifgChange}

                                                            /> : ''
                                }
                                <FormItem label="#">
                                    <Button type="primary" size='large' onClick={this.submit} disabled={disabled} loading={loading}  style={{ width : '100%' }}>下一步</Button>
                                </FormItem>
                            </Form>
                        </div>
                    )
                
                }
            </div>
        )
    }
};
const LinkState = props =>{
    return(
        <div style={{width:260,textAlign:'center',marginTop:-15}}>
            <CustomIcon type="hint" size="large" color="#FF5500"/>
            <h3 style={{marginBottom:25,marginTop:17}}>请检查你的网线是否插好</h3>
            <Button type="primary" size='large' onClick={props.dialDetect} style={{ width : '100%' }}>已经插好网线，再试一次</Button>
            <div className="help">
                    <a style={{width:'100%',textAlign:'right',marginTop:5}} href="javascript:;" className="ui-tips" onClick={props.OnwanLinkState}>跳过，直接设置</a>
            </div>
        </div>
    );
};

const NetStatus = props => {
    return props.online ?
        (<div className="progress-tip">
            <CustomIcon type="correct" size="large" color="#87d067" />
            <h3>已连接网络，正在跳转到带宽设置…</h3>
        </div>) :
        (<div className="progress-tip" style={{ width : 260 }}>
            <CustomIcon type="hint" size="large" color="#FF5500" />
            <h3 style={{ marginBottom : 15 }}>无法连接互联网</h3>
            {/* <h4>请检查您的宽带帐号密码是否正确</h4> */}
            <Button type="primary" style={{ width: "100%" }} onClick={props.reSet} size='large'>重新设置</Button>
            <div className="help">
                <a href="javascript:;" onClick={props.reSet} className="ui-tips">上一步</a>
                <a href="javascript:;" className="ui-tips" onClick={props.nextStep}>跳过，直接设置无线网络</a>
            </div>
        </div>)
}

const PPPOE = props => {
    return [
        <FormItem key='account' label="账号">
            <FormInput placeholder="请输入账号"
                type="text"
                name="pppoe-account"
                value={props.pppoeAccount}
                onBlur={props.handleAccountBlur}
                onChange={props.handleAccountChange} />
        </FormItem>,
        <FormItem key='password' label="密码">
            <FormInput 
                value={props.pppoePassword}
                placeholder="密码" 
                name="pppoe-password"
                onBlur={props.handlePasswordBlur}
                onChange={props.handlePasswordChange} />
        </FormItem>
    ];
};

// 静态 IP 配置
const StaticIp = props => {
    return [
        <FormItem key='ip' label="IP地址">
            <InputGroup
                inputs={[{value : props.ip[0], maxLength : 3}, {value : props.ip[1], maxLength : 3}, {value : props.ip[2], maxLength : 3}, {value : props.ip[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'ip')} />
        </FormItem>,
        <FormItem key='subnetmask' label="子网掩码">
            <InputGroup                                                                         
                inputs={[{value : props.subnetmask[0], maxLength : 3}, {value : props.subnetmask[1], maxLength : 3}, {value : props.subnetmask[2], maxLength : 3}, {value : props.subnetmask[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'subnetmask')} />
        </FormItem>,
        <FormItem key='gateway' label="网关">
            <InputGroup 
                inputs={[{value : props.gateway[0], maxLength : 3}, {value : props.gateway[1], maxLength : 3}, {value : props.gateway[2], maxLength : 3}, {value : props.gateway[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'gateway')} />
        </FormItem>,
        <FormItem key='dns' label="首选DNS">
            <InputGroup 
                inputs={[{value : props.dns[0], maxLength : 3}, {value : props.dns[1], maxLength : 3}, {value : props.dns[2], maxLength : 3}, {value : props.dns[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'dns')} />
        </FormItem>,
        <FormItem key='dnsbackup' label="备选DNS">
            <InputGroup 
                inputs={[{value : props.dnsbackup[0], maxLength : 3}, {value : props.dnsbackup[1], maxLength : 3}, {value : props.dnsbackup[2], maxLength : 3}, {value : props.dnsbackup[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'dnsbackup')}
            />
        </FormItem>
    ];
};






