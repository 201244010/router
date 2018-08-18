import React from 'react';
import { Progress } from 'antd';
import classnames from 'classnames';
import Form from '~/components/Form';
import { Select, Button } from "antd";
import Icon from '~/components/Icon';

const { FormItem, Input : FormInput, InputGroup  } = Form;
const Option = Select.Option;


export default class SetWan extends React.PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        percent : 0,
        test : true,
        type : 'pppoe',
        status : "active",

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

    increase = (step = 10) => {
        this.setState(prevState => ({
            percent : prevState.percent + step
        }), function(){
            if(this.state.percent >= 100 && this.timer){
                const probability = Math.random() * 10 > 2;
                if(probability){
                    this.setState({ status : 'success' }, function(){
                        setTimeout(()=>{
                            this.setState({ test : false });
                        }, 2000)
                    });
                }
                else {
                    this.setState({ status : 'exception' });
                }
                clearInterval(this.timer);
            }
        });
    }

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


    handlePasswordChange = value => {
        this.setState({ pppoePassword : value }, function(){
            this.setState({
                disabled : !this.checkParams()
            });
        });
    };

    handlePasswordBlur = ()=>{
        if(this.state.pppoePassword.length === 0 ){
            this.setState({
                pppoePasswordTip : "PPPOE 密码不能为空"
            });
        }
    }

    checkParams(){
        let { type, pppoeAccount, pppoePassword, dns, ip, dnsbackup, gateway, subnetmask } = this.state;
        switch(type){
            case 'pppoe' :
                if(pppoeAccount.length === 0 || pppoePassword.length === 0){
                    return false;
                }
                break;
            case 'staticip' :
                let empty = [dns, ip, dnsbackup, subnetmask, gateway].some(field => {
                    if(field.length === 0){
                        return true;
                    }
                    return field.some(f => {
                        return (f === '' || f === null || f === undefined);
                    });
                })
                if(empty){
                    return false;
                }            
                break;
        }
        return true;
    }

    componentDidMount(){
       this.timer = setInterval(()=>{
           this.increase();
       }, 300) 
    }

    onIPConifgChange = (value, field) => {
        this.setState({ [field] : value }, function() {
            this.setState({
                disabled : !this.checkParams()
            });
        });
    }

    back = () => {
        this.props.history.go(-1);
    }

    nextStep = () => this.setState({ test : false})

    render(){
        const { test, status, percent, type, disabled, loading, ip, gateway, dns, dnsbackup, subnetmask} = this.state;
        return (
            <div className="set-wan">
                <h2>设置管理员密码</h2> 
                <p className="ui-tips guide-tip">管理员密码是进入路由器管理页面的凭证 </p>
                <div className={classnames(["ui-center speed-test", {'none' : !test}])}>
                    <NetTest percent={percent} 
                            status={status} 
                            reSet={this.back}
                            nextStep={this.nextStep} />
                </div>
                <div className={classnames(['wan', {'block' : !test}])}>
                    <Form style={{ margin : '0 auto' }}>
                        <FormItem label="上网方式">
                            <Select defaultValue="pppoe" style={{ width: "100%" }} onChange={this.handleChange}>
                                <Option value="pppoe">宽带账号上网（PPPoE）</Option>
                                <Option value="dhcp">自动获取IP（DHCP）</Option>
                                <Option value="staticip">手动输入IP（静态IP）</Option>
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
                            type === 'staticip' ? <StaticIp ip={ip} 
                                                            dns={dns} 
                                                            gateway={gateway} 
                                                            subnetmask={subnetmask}
                                                            dnsbackup={dnsbackup} 
                                                            onChange={this.onIPConifgChange}

                                                    /> : ''
                        }
                        <FormItem label="#">
                            <Button type="primary" disabled={disabled} loading={loading}  style={{ width : '100%' }}>下一步</Button>
                        </FormItem>
                        {
                            (type === 'pppoe' || type === 'dhcp') ? <FormItem label="#" style={{ marginTop : -20 }}>
                                <div className="help">
                                    <a href="javascript:;" onClick={this.back} className="ui-tips">上一步</a>
                                    {type === 'pppoe' ? <a href="javascript:;" className="ui-tips">忘记宽带账号密码</a> : ""}
                                </div>
                            </FormItem> : ""
                        }
                    </Form>
                </div>
            </div>
        )
    }
};


const NetTest = props => {
    switch(props.status){
        case 'active' :
            return [
                <Progress key="progress-active" type="circle" gapPosition="bottom" 
                            strokeColor="red"
                            width={80}
                            style={{ marginBottom : 30 }}
                            status={props.status}
                            // format={percent => `${percent}%`} 
                            percent={props.percent} />,
                <h3 key="active-h3">正在检测是否联网，请稍后...</h3>
            ]
        case 'exception' :
            return (<div className="progress-tip" style={{ width : 260 }}>
                    <Icon type="mistake" size="large" color="#d33519" />
                    <h3>无法连接互联网</h3>
                    <h4>请检查您的宽带帐号密码是否正确</h4>
                    <Button type="primary"  style={{ width : "100%" }} onClick={props.reSet} size="large">重新设置</Button>
                    <div className="help">
                        <a href="javascript:;" onClick={props.reSet} className="ui-tips">上一步</a>
                        <a href="javascript:;" className="ui-tips" onClick={props.nextStep}>跳过，直接设置无线网络</a>
                    </div>
                </div>);
        case 'success' :
            return (<div className="progress-tip">
                <Icon type="correct" size="large" color="#87d067" />
                <h3>已连接网络，正在跳转到带宽设置…</h3>
            </div>);
        
    }
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






