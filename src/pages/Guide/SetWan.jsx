import React from 'react';
import { Icon,message } from 'antd';
import { Base64 } from 'js-base64';
import classnames from 'classnames';
import Form from '~/components/Form';
import { Select, Button } from "antd";
import CustomIcon from '~/components/Icon';
import { checkStr, checkIp, checkMask } from '~/assets/common/check';


const { FormItem, Input : FormInput, InputGroup, ErrorTip } = Form;
const Option = Select.Option;


export default class SetWan extends React.PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        detect : true,
        type : 'dhcp', // pppoe | dhcp | static
        showNetWorkStatus : false,
        wanLinkState: true,

        // pppoe
        pppoeAccount : '',
        pppoeAccountTip : '',
        pppoePassword : '',
        pppoePasswordTip : '',
        disabled : false,
        loading : false,

        // 静态 ip
        ip : ["","","",""],
        subnetmask : ["","","",""],
        gateway : ["","","",""],
        dns : ["","","",""],
        dnsbackup : ["","","",""],
        ipTip: '', 
        subnetmaskTip: '', 
        gatewayTip: '', 
        dnsTip: '', 
        dnsbackupTip: '',
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
        const tip = checkStr(value,{who:'账号',min: 1,max: 64,type: 'all'});
        this.setState({ pppoeAccount : value }, function(){
            this.setState({
                pppoeAccountTip: tip,
                disabled : !this.checkParams() ||  tip !== '',
            });
        });
    }

    handleAccountBlur = value =>{
            const tip = checkStr(value,{who:'账号',min: 1,max: 64,type: 'all'});
            this.setState({
                pppoeAccountTip : tip,
                disabled : !this.checkParams() ||  tip !== '',
            });
        
    }

    componentWillUnmount(){
        this.stop = true;
    }

    // 处理pppoe 密码框 change
    handlePasswordChange = value => {
        const tip = checkStr(value,{who:'密码',min: 1,max: 32,type: 'english'});
        this.setState({ pppoePassword : value }, function(){
            this.setState({
                pppoePasswordTip : tip,
                disabled : !this.checkParams() ||  tip !== '',
            });
        });
    };

    // pppoe 密码输入框失去焦点
    handlePasswordBlur = value =>{
        const tip = checkStr(value,{who:'密码',min: 1,max: 32,type: 'english'});
        if(this.state.pppoePassword.length === 0 ){
            this.setState({
                pppoePasswordTip : tip,
                disabled : !this.checkParams() ||  tip !== '',
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
                    username : Base64.encode(pppoeAccount),
                    password : Base64.encode(pppoePassword)
                };
                break;
            case 'static' :
                wan.info = {
                    ipv4 : ip.join('.'),
                    mask : subnetmask.join('.'),
                    gateway : gateway.join('.'),
                    dns1 : dns.join('.'),
                    dns2 : dnsbackup.every(item => item.length === 0)? '' : dnsbackup.join('.')
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
            message.error(`IP地址与默认网关不能相同`);
            return ;
        }
        this.setState({ loading : true });
        let response = await common.fetchApi(
            [
                {opcode: 'NETWORK_WAN_IPV4_SET', data: payload}
            ]
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

    // 校验参数
    checkParams(){
        let { type, pppoeAccount, pppoePassword, dns, ip, dnsbackup, dnsbackupTip, gateway, subnetmask } = this.state;
        switch(type){
            case 'pppoe' :
                if(pppoeAccount.length === 0 || pppoePassword.length === 0){
                    return false;
                }
                break;
            case 'static' :
                let ckDnsbackup = (dnsbackup.every(item => item.length === 0)?  false : dnsbackupTip !== '');
                let empty = [dns, ip, subnetmask, gateway].some(field => {
                    if(field.length === 0 || ckDnsbackup){
                        return true;
                    }
                    return field.some(f => {
                        if(f == null || typeof f === 'undefined' || f === '' || dnsbackup == null || typeof dnsbackup === 'undefined' ){
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
        this.setState({ detect: true });
        common.fetchApi(
            [
                {opcode: 'WANWIDGET_WAN_LINKSTATE_GET'}
            ],
        ).then((resp) => {
            const { errcode,data } = resp;
            if(errcode == 0){
                this.setState({wanLinkState : data[0].result.wan_linkstate.linkstate});
                if(data[0].result.wan_linkstate.linkstate){
                    common.fetchApi(
                        [
                            {opcode: 'WANWIDGET_DIALDETECT_START'}
                        ],
                    ).then(()=>{
                        common.fetchApi(
                            [
                                {opcode: 'WANWIDGET_DIALDETECT_GET'}
                            ],
                            {},
                            { 
                                loop : true, 
                                interval : 2000,
                                pending : res => res.data[0].result.dialdetect.status === 'detecting', 
                                stop : () => this.stop
                            }
                        ).then((response)=>{
                            const { errcode, data } = response;
                            if(errcode == 0){
                                let { dialdetect } = data[0].result;
                                let { dial_type } = dialdetect;
                                    dial_type  = dial_type === 'none' ? 'dhcp' : dial_type;
                                    this.setState({ 
                                    type :  dial_type, 
                                    disabled : dial_type == 'dhcp' ? false : true 
                                    });
                                    this.setState({ detect: false });
                                    return;
                            }else{
                                this.setState({ detect: false });
                                message.error(`上网方式检查检测失败[${errcode}]`);
                            }
                        }); 
                    }); 
                }else{
                    this.setState({ detect: false });
                }   
            }else{
                message.error(`获取网线插拔状态失败[${errcode}]`);
            }          
        });
        
    }

    getNetInfo = async ()=>{
        let response = await common.fetchApi(
            [
                {opcode: 'NETWORK_WAN_IPV4_GET'}
            ],
            {},
            { 
                loop : true, 
                pending : res => res.data[0].result.dialdetect === 'detecting', 
                stop : ()=> this.stop 
            }
        ).catch(ex=>{});
        let { data, errcode } = response;
        if(errcode == 0){
            this.netInfo = data[0].result.wan;
            return;
        }
        message.error(`IP信息获取失败[${errcode}]`);
    }

    componentDidMount(){
        // 检测上网方式
        this.dialDetect();
        // 获取网络情况
        this.getNetInfo(); 
    }

    onIPConifgChange = (val, key) => {
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
        let tip = valid[key].func(val, {who : valid[key].who});
        if(key === 'dnsbackup' && val.every(item => item.length === 0)){
            tip = '';
        }
        this.setState({
            [key] : (typeof val == 'object' ? [...val] : val),
            [key + 'Tip'] : tip
        },()=>{
            this.setState({disabled : !this.checkParams()});
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
        const { detect, online, type, disabled, loading, showNetWorkStatus, ip, gateway, dns, dnsbackup, subnetmask,wanLinkState, ipTip, subnetmaskTip, gatewayTip, dnsTip, dnsbackupTip} = this.state;
        return (
            <div className="set-wan">
                <h2>设置上网参数</h2> 
                <p className="ui-tips guide-tip">上网参数设置完成后，即可连接网络 </p>
                {/* 网络嗅探 SPIN */}
                <div className={classnames(["ui-center speed-test", {'none' : !detect}])}>
                    <Icon key="progress-icon" type="loading" style={{ fontSize: 80, marginBottom : 30, color : "#FB8632" }}  spin />
                    <h3 key="active-h3">正在检查上网方式，请稍候...</h3>
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
                                    <div style={{ padding: 0, position: 'relative' }} id="typeArea">
                                        <Select value={type} style={{ width: "100%" }} onChange={this.handleChange} getPopupContainer={() => document.getElementById('typeArea')}>
                                            <Option value="pppoe">宽带拨号上网（PPPoE）</Option>
                                            <Option value="dhcp">自动获取IP（DHCP）</Option>
                                            <Option value="static">手动输入IP（静态IP）</Option>
                                        </Select>
                                    </div>
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
                                                                    ipTip={ipTip}
                                                                    subnetmaskTip={subnetmaskTip}
                                                                    gatewayTip={gatewayTip}
                                                                    dnsTip={dnsTip}
                                                                    dnsbackupTip={dnsbackupTip}
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
                    <a style={{width:'100%',textAlign:'right',marginTop:5}} href="javascript:;" className="ui-tips" onClick={props.OnwanLinkState}>跳过</a>
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
                <a href="javascript:;" className="ui-tips" onClick={props.nextStep}>跳过</a>
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
                onChange={props.handleAccountChange} 
                maxLength='64'/>
            <ErrorTip style={{color: '#fb8632'}}>{props.pppoeAccountTip}</ErrorTip>
        </FormItem>,
        <FormItem key='password' label="密码">
            <FormInput 
                value={props.pppoePassword}
                placeholder="密码" 
                name="pppoe-password"
                onBlur={props.handlePasswordBlur}
                onChange={props.handlePasswordChange} 
                maxLength='32'/>
            <ErrorTip style={{color: '#fb8632'}}>{props.pppoePasswordTip}</ErrorTip>
        </FormItem>
    ];
};

// 静态 IP 配置
const StaticIp = props => {
    return [
        <FormItem key='ip' label="IP地址" showErrorTip={props.ipTip}>
            <InputGroup
                inputs={[{value : props.ip[0], maxLength : 3}, {value : props.ip[1], maxLength : 3}, {value : props.ip[2], maxLength : 3}, {value : props.ip[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'ip')} />
                <ErrorTip>{props.ipTip}</ErrorTip>
        </FormItem>,
        <FormItem key='subnetmask' label="子网掩码" showErrorTip={props.subnetmaskTip}>
            <InputGroup                                                                         
                inputs={[{value : props.subnetmask[0], maxLength : 3}, {value : props.subnetmask[1], maxLength : 3}, {value : props.subnetmask[2], maxLength : 3}, {value : props.subnetmask[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'subnetmask')} />
            <ErrorTip>{props.subnetmaskTip}</ErrorTip>
        </FormItem>,
        <FormItem key='gateway' label="默认网关" showErrorTip={props.gatewayTip}>
            <InputGroup 
                inputs={[{value : props.gateway[0], maxLength : 3}, {value : props.gateway[1], maxLength : 3}, {value : props.gateway[2], maxLength : 3}, {value : props.gateway[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'gateway')} />
            <ErrorTip>{props.gatewayTip}</ErrorTip>
        </FormItem>,
        <FormItem key='dns' label="首选DNS" showErrorTip={props.dnsTip}>
            <InputGroup 
                inputs={[{value : props.dns[0], maxLength : 3}, {value : props.dns[1], maxLength : 3}, {value : props.dns[2], maxLength : 3}, {value : props.dns[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'dns')} />
            <ErrorTip>{props.dnsTip}</ErrorTip>
        </FormItem>,
        <FormItem key='dnsbackup' label="备选DNS(选填)" showErrorTip={props.dnsbackupTip}>
            <InputGroup 
                inputs={[{value : props.dnsbackup[0], maxLength : 3}, {value : props.dnsbackup[1], maxLength : 3}, {value : props.dnsbackup[2], maxLength : 3}, {value : props.dnsbackup[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'dnsbackup')} />
            <ErrorTip>{props.dnsbackupTip}</ErrorTip>
        </FormItem>
    ];
};






