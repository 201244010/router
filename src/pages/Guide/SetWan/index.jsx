import React from 'react';
import { Icon,message } from 'antd';
import { Base64 } from 'js-base64';
import classnames from 'classnames';
import Form from '~/components/Form';
import { Select, Button } from "antd";
import CustomIcon from '~/components/Icon';
import { checkStr, checkIp, checkMask, checkSameNet } from '~/assets/common/check';

import './setwan.scss';

const MODULE = 'setwan';
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
        const tip = checkStr(value,{who: intl.get(MODULE, 0)/*_i18n:账号*/,min: 1,max: 64,type: 'all'});
        this.setState({ pppoeAccount : value }, function(){
            this.setState({
                pppoeAccountTip: tip,
                disabled : !this.checkParams() ||  tip !== '',
            });
        });
    }

    handleAccountBlur = value =>{
            const tip = checkStr(value,{who: intl.get(MODULE, 1)/*_i18n:账号*/,min: 1,max: 64,type: 'all'});
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
        const tip = checkStr(value,{who: intl.get(MODULE, 2)/*_i18n:密码*/,min: 1,max: 32,type: 'english'});
        this.setState({ pppoePassword : value }, function(){
            this.setState({
                pppoePasswordTip : tip,
                disabled : !this.checkParams() ||  tip !== '',
            });
        });
    };

    // pppoe 密码输入框失去焦点
    handlePasswordBlur = value =>{
        const tip = checkStr(value,{who: intl.get(MODULE, 3)/*_i18n:密码*/,min: 1,max: 32,type: 'english'});
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
            // message.error(`IP地址与默认网关不能相同`);
            message.error(intl.get(MODULE, 4)/*_i18n:IP地址与默认网关不能相同*/);   
            return ;
        }
        if(!checkSameNet(this.state.ip,this.state.gateway,this.state.subnetmask)){
            this.setState({
                disabled: false,
                loading: false,
            });
            // message.error( 'IP地址与默认网关需在同一网段' );
            message.error(intl.get(MODULE, 5)/*_i18n:IP地址与默认网关需在同一网段*/);
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
                        setTimeout(() => { this.props.history.push("/guide/setwifi/setting") }, 3000);
                    }
                    return;
                }
            });  
        }else{
            // message.error(`参数不合法[${errcode}]`);
            message.error(intl.get(MODULE, 6, {error: errcode})/*_i18n:参数不合法[{error}]*/);
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
                                // message.error(`上网方式检查检测失败[${errcode}]`);
                                message.error(intl.get(MODULE, 7, {error: errcode})/*_i18n:上网方式检查检测失败[{error}]*/);
                            }
                        }); 
                    }); 
                }else{
                    this.setState({ detect: false });
                }   
            }else{
                // message.error(`获取网线插拔状态失败[${errcode}]`);
                message.error(intl.get(MODULE, 8, {error: errcode})/*_i18n:获取网线插拔状态失败[{error}]*/);
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
        );
        let { data, errcode } = response;
        if(errcode == 0){
            this.netInfo = data[0].result.wan;
            return;
        }
        // message.error(`IP信息获取失败[${errcode}]`);
        message.error(intl.get(MODULE, 9, {error: errcode})/*_i18n:IP信息获取失败[{error}]*/);
    }

    componentDidMount(){
        // 检测上网方式
        this.dialDetect();
        // 获取网络情况
        setTimeout(this.getNetInfo, 500);
    }

    onIPConifgChange = (val, key) => {
        let valid = {
            ip:{
                func: checkIp,
                // who:'IP地址',
                who: intl.get(MODULE, 10)/*_i18n:IP地址*/,
            },
            subnetmask:{
                func: checkMask,
                // who:'子网掩码',
                who: intl.get(MODULE, 11)/*_i18n:子网掩码*/,
            },
            gateway:{
                func: checkIp,
                // who:'默认网关',
                who: intl.get(MODULE, 12)/*_i18n:默认网关*/,
            },
            dns:{
                func: checkIp,
                // who:'首选DNS',
                who: intl.get(MODULE, 13)/*_i18n:首选DNS*/,
            },
            dnsbackup:{
                func: checkIp,
                // who:'备选DNS',
                who: intl.get(MODULE, 14)/*_i18n:备选DNS*/,
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
        // this.setState({
        //     wanLinkState:true
        // })
        this.setState({ detect : false});
        this.props.history.push("/guide/setwifi");
    }
    
    render(){
        const { detect, online, type, disabled, loading, showNetWorkStatus, ip, gateway, dns, dnsbackup, subnetmask,wanLinkState, ipTip, subnetmaskTip, gatewayTip, dnsTip, dnsbackupTip} = this.state;
        return (
            <div className="set-wan">
                <h2>{intl.get(MODULE, 15)/*_i18n:设置上网参数*/}</h2> 
                <p className="ui-tips guide-tip">{intl.get(MODULE, 16)/*_i18n:上网参数设置完成后，即可连接网络*/}</p>
                {/* 网络嗅探 SPIN */}
                <div className={classnames(["ui-center speed-test", {'none' : !detect}])}>
                    <div className="bigLoading">
                        <CustomIcon className='bigLoading-icon-loading' size={80} type="loading" spin />
                    </div>
                    <h3 key="active-h3" className='speed-test-tip'>{intl.get(MODULE, 17)/*_i18n:正在检查上网方式，请稍候...*/}</h3>
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
                            <Form className='wan-form'>
                                <FormItem 
                                    label={intl.get(MODULE, 18)/*_i18n:上网方式*/}
                                    labelStyle={{position: 'absolute',right: 272}}
                                    >
                                    <div style={{ padding: 0, position: 'relative',borderRadius: 8 }} id="typeArea">
                                        <Select value={type} style={{ width: "100%" }} onChange={this.handleChange} getPopupContainer={() => document.getElementById('typeArea')}>
                                            <Option value="pppoe">{intl.get(MODULE, 19)/*_i18n:宽带拨号上网（PPPoE）*/}</Option>
                                            <Option value="dhcp">{intl.get(MODULE, 20)/*_i18n:自动获取IP（DHCP）*/}</Option>
                                            <Option value="static">{intl.get(MODULE, 21)/*_i18n:手动输入IP（静态IP）*/}</Option>
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
                                <FormItem
                                    label="#"
                                    >
                                    <Button
                                        className="nextButton" 
                                        type="primary"
                                        size='large'
                                        onClick={this.submit}
                                        disabled={disabled}
                                        loading={loading}
                                        >{intl.get(MODULE, 22)/*_i18n:下一步*/}
                                    </Button>
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
    const { dialDetect, OnwanLinkState } = props;
    return(
        <div className='linkState'>
            <CustomIcon className='linkState-icon-hint' type="hint" size="large"/>
            <h3 className='linkState-h3'>{intl.get(MODULE, 23)/*_i18n:请检查您的网线是否插好*/}</h3>
            <Button className='linkState-button' type="primary" size='large' onClick={dialDetect}>{intl.get(MODULE, 24)/*_i18n:已经插好网线，再试一次*/}</Button>
            <div className="setwan-help">
                <a className='a-right' href="javascript:void(0);" onClick={OnwanLinkState}>{intl.get(MODULE, 25)/*_i18n:跳过*/}</a>
            </div>
        </div>
    );
};

const NetStatus = props => {
    const { online, reSet, nextStep } = props;
    return online ?
        (<div className="progress-tip">
            <CustomIcon className='progress-icon-correct' type="correct" size="large" />
            <h3>{intl.get(MODULE, 26)/*_i18n:已连接网络，正在跳转到无线网络设置...*/}</h3>
        </div>) :
        (<div className="progress-tip" style={{ width : 260 }}>
            <CustomIcon className='progress-icon-hint' type="hint" size="large" />
            <h3>{intl.get(MODULE, 27)/*_i18n:无法连接互联网*/}</h3>
            {/* <h4>请检查您的宽带帐号密码是否正确</h4> */}
            <Button className='progress-tip-button' type="primary" onClick={reSet} size='large'>{intl.get(MODULE, 28)/*_i18n:重新设置*/}</Button>
            <div className="setwan-help">
                <a className='a-left' href="javascript:void(0);" onClick={reSet}>{intl.get(MODULE, 29)/*_i18n:上一步*/}</a>
                <a className='a-right' href="javascript:void(0);" onClick={nextStep}>{intl.get(MODULE, 30)/*_i18n:跳过*/}</a>
            </div>
        </div>)
}

const PPPOE = props => {
    const { pppoeAccount, handleAccountBlur, handleAccountChange, pppoeAccountTip, pppoePassword, handlePasswordBlur, handlePasswordChange, pppoePasswordTip } = props;
    return [
        <FormItem
            key='account'
            label={intl.get(MODULE, 31)/*_i18n:账号*/}
            labelStyle={{position: 'absolute',right: 272}}
            >
            <FormInput placeholder={intl.get(MODULE, 32)/*_i18n:请输入账号*/}
                type="text"
                name="pppoe-account"
                value={pppoeAccount}
                onBlur={handleAccountBlur}
                onChange={handleAccountChange} 
                maxLength='64'/>
            <ErrorTip style={{color: '#fb8632'}}>{pppoeAccountTip}</ErrorTip>
        </FormItem>,
        <FormItem
            key='password'
            label={intl.get(MODULE, 33)/*_i18n:密码*/}
            labelStyle={{position: 'absolute',right: 272}}
            >
            <FormInput 
                value={pppoePassword}
                placeholder={intl.get(MODULE, 34)/*_i18n:密码*/} 
                name="pppoe-password"
                onBlur={handlePasswordBlur}
                onChange={handlePasswordChange} 
                maxLength='32'/>
            <ErrorTip style={{color: '#fb8632'}}>{pppoePasswordTip}</ErrorTip>
        </FormItem>
    ];
};

// 静态 IP 配置
const StaticIp = props => {
    const { ipTip, ip, onChange, subnetmaskTip, subnetmask, gatewayTip, gateway, dnsTip, dns, dnsbackupTip, dnsbackup } = props;
    return [
        <FormItem
            key='ip'
            label={intl.get(MODULE, 35)/*_i18n:IP地址*/}
            labelStyle={{position: 'absolute',right: 272}}
            showErrorTip={ipTip}
            >
            <InputGroup
                inputs={[{value : ip[0], maxLength : 3}, {value : ip[1], maxLength : 3}, {value : ip[2], maxLength : 3}, {value : ip[3], maxLength : 3}]}
                onChange={value => onChange(value, 'ip')} />
                <ErrorTip>{ipTip}</ErrorTip>
        </FormItem>,
        <FormItem
            key='subnetmask'
            label={intl.get(MODULE, 36)/*_i18n:子网掩码*/}
            labelStyle={{position: 'absolute',right: 272}}
            showErrorTip={subnetmaskTip}
            >
            <InputGroup                                                                         
                inputs={[{value : subnetmask[0], maxLength : 3}, {value : subnetmask[1], maxLength : 3}, {value : subnetmask[2], maxLength : 3}, {value : subnetmask[3], maxLength : 3}]} 
                onChange={value => onChange(value, 'subnetmask')} />
            <ErrorTip>{subnetmaskTip}</ErrorTip>
        </FormItem>,
        <FormItem
            key='gateway'
            label={intl.get(MODULE, 37)/*_i18n:默认网关*/}
            labelStyle={{position: 'absolute',right: 272}}
            showErrorTip={gatewayTip}
            >
            <InputGroup 
                inputs={[{value : gateway[0], maxLength : 3}, {value : gateway[1], maxLength : 3}, {value : gateway[2], maxLength : 3}, {value : gateway[3], maxLength : 3}]} 
                onChange={value => onChange(value, 'gateway')} />
            <ErrorTip>{gatewayTip}</ErrorTip>
        </FormItem>,
        <FormItem
            key='dns'
            label={intl.get(MODULE, 38)/*_i18n:首选DNS*/}
            labelStyle={{position: 'absolute',right: 272}}
            showErrorTip={dnsTip}
            >
            <InputGroup 
                inputs={[{value : dns[0], maxLength : 3}, {value : dns[1], maxLength : 3}, {value : dns[2], maxLength : 3}, {value : dns[3], maxLength : 3}]} 
                onChange={value => onChange(value, 'dns')} />
            <ErrorTip>{dnsTip}</ErrorTip>
        </FormItem>,
        <FormItem
            key='dnsbackup'
            label={intl.get(MODULE, 39)/*_i18n:备选DNS(选填)*/}
            labelStyle={{position: 'absolute',right: 272}}
            showErrorTip={dnsbackupTip}
            >
            <InputGroup 
                inputs={[{value : dnsbackup[0], maxLength : 3}, {value : dnsbackup[1], maxLength : 3}, {value : dnsbackup[2], maxLength : 3}, {value : dnsbackup[3], maxLength : 3}]} 
                onChange={value => onChange(value, 'dnsbackup')} />
            <ErrorTip>{dnsbackupTip}</ErrorTip>
        </FormItem>
    ];
};






