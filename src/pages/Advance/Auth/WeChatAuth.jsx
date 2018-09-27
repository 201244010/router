
import React from "react";
import PanelHeader from '~/components/PanelHeader';
import Form from '~/Components/Form';
import {Modal ,Select} from 'antd';

const {FormItem,Input} = Form;
const Option = Select.Option;

export default class WeChatAuth extends React.Component{
    constructor(props){
        super(props);
    }
    
    state = {
        enable : false,
        onlineLimit : '60',
        idleLimit : '10',
        selectedSsid : 'W1-Test-2.4G',
        logo : '欢迎您',
        welcome : '欢迎使用微信连Wi-Fi',
        loginHint : '一键打开微信连Wi-Fi',
        statement : '由Sunmi为您提供Wi-Fi服务',
        ssid : "W1-wxTest",
        shopId :"17231844",
        appId : "wxd7faaa125d198e2d",
        secretKey : "c9f39b0676a850901b063c1e2056f2d0",
        ssidList :[
            {"ssid":"W1-Test-2.4G", "enable":"1"},
            {"ssid":"W1-Test-5G", "enable":"1"}
        ]
    }

    onEnableChange = type =>{
        this.setState({
            enable : type
        })
    }

    onChange = (name,value) =>{
        this.setState({
            [name] : value
        })
    }
    async fetchWeChatAuthInfo(){
        let response = await common.fetchWithCode('AUTH_WEIXIN_CONFIG_GET',{method : 'post'},{handleError : true});
        let {errcode,data,message} = response;
        if(errcode == 0){
            let {weixin} = data[0].result;
            this.weixin = weixin;
            this.setState({
                enable : this.weixin.enable,
                onlineLimit : this.weixin.online_limit,
                idleLimit : this.weixin.idle_limit,
                selectedSsid : this.weixin.selected_ssid,
                logo : this.weixin.logo,
                welcome : this.weixin.welcome,
                loginHint : this.weixin.login_hint,
                statement : this.weixin.statement,
                ssid : this.weixin.ssid,
                shopId : this.weixin.shopid,
                appId : this.weixin.appid,
                secretKey : this.weixin.secretkey,
                //ssidList : this.weixin.ssidlist,
            });
            return ;
        }
        Modal.error({title  : '微信认证的信息获取失败', content : message});
    }

    componentDidMount(){
        this.fetchWeChatAuthInfo();
    }

    render(){
        
        
        const {enable,onlineLimit,idleLimit,selectedSsid,logo,welcome,loginHint,statement,ssid,shopId,appId,secretKey,ssidList} = this.state;
        const ssidListOption = ssidList.map(ssidOption =><Option key ={ssidOption.ssid}>{ssidOption.ssid}</Option>);
        return (
            <div>
                <Form>
                    <PanelHeader title = "功能设置" checkable={true} checked={enable} onChange={this.onEnableChange}/>
                    <label>上网时长</label>
                    <FormItem type="small" style={{ width : 320}}>
                        <Input type="text" disabled={false} value={onlineLimit} onChange={(value)=>this.onChange('onlineLimit',value)} />
                    </FormItem>
                    <label>空闲断线</label>
                    <FormItem type="small" style={{ width : 320}}>
                        <Input type="text" disabled={false} value={idleLimit} onChange={(value)=>this.onChange('idleLimit',value)} />
                    </FormItem>
                    <label>上网时长</label>
                    <Select style={{width:320}}>{ssidListOption}</Select>
                </Form>
            </div>
        );
    }
}