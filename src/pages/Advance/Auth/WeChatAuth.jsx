
import React from "react";
import { Modal , Select, Button, Upload, Icon, message } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import { checkStr, checkRange } from '~/assets/common/check';


const { FormItem, Input, ErrorTip } = Form;
const Option = Select.Option;

export default class WeChatAuth extends React.Component{
    constructor(props){
        super(props);
    }
    
    state = {
        enable: false,
        onlineLimit: '',
        onlineLimitTip: '',
        idleLimit: '',
        idleLimitTip: '',
        logo: '欢迎您',
        logoTip: '',
        welcome: '欢迎使用微信连Wi-Fi',
        welcomeTip: '',
        loginHint: '一键打开微信连Wi-Fi',
        loginHintTip: '',
        statement: '由Sunmi为您提供Wi-Fi服务',
        statementTip: '',
        ssid: '',
        ssidTip: '',
        shopId:'',
        shopIdTip:'',
        appId: '',
        appIdTip: '',
        secretKey: '',
        secretKeyTip: '',
        selectedSsid: [],
        children: [],
        weixinLogoFileList: [],
        weixinBgFileList: [],
        loading: false
    }
    
    handleWeixinLogoChange = (info) => {
        let fileList = info.fileList;
    
        // 1. Limit the number of uploaded files
        fileList = fileList.slice(-1);
    
        //2.Filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
            if (file.type == 'image/png' || file.type == 'image/jpeg') {
                
                return true;
            }
            return false;
        });
        this.setState({ weixinLogoFileList: fileList });
      }

    handleWeixinBgChange = (info) => {
        let fileList = info.fileList;
    
        // 1. Limit the number of uploaded files
        fileList = fileList.slice(-1);
    
        //2.Filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
            if (file.type == 'image/png' || file.type == 'image/jpeg') {
                
                return true;
            }
            return false;
        });
        this.setState({ weixinBgFileList: fileList });
    }

    beforeUpload = (file) => {
        let isImage = file.type;
        if( isImage === "image/png" || isImage === "image/jpeg" ){    
        return true;
        }
        message.error('只能上传带.jpg、.png后缀的图片文件');
        return false;
    }  
    
    onEnableChange = type =>{
        this.setState({
            enable : type,
            disableType:!type
        })
    }

    onChange = (name,value) =>{
        const field = {
            onlineLimit:{
                func: checkRange(value, { min: 1,max: 1440,who: '上网时长' })
            },
            idleLimit:{
                func: checkRange(value, { min: 1,max: 1440,who: '空闲断线' })
            },
            
            logo:{
                func: checkStr(value, { who: 'logo信息', min: 1, max: 15 })
            },
            
            welcome:{
                func: checkStr(value, { who: '欢迎信息', min: 1, max: 30 })
            },
            
            loginHint:{
                func: checkStr(value, { who: '提示文字', min: 1, max: 15 })
            },
            
            statement:{
                func: checkStr(value, { who: '版权声明', min: 1, max: 30 })
            },
            
            ssid:{
                func: checkStr(value, { who: 'SSID', min: 1, max: 32, type: 'english'})
            },
            
            shopId:{
                func: checkStr(value, { who: 'ShopID', min: 1, max: 32, type: 'english'})
            },
            
            appId:{
                func: checkStr(value, { who: 'AppID', min: 1, max: 32, type: 'english'})
            },
            
            secretKey:{
                func: checkStr(value, { who: 'SecretKey', min: 1, max: 32, type: 'english'})
            },
            
        };
        const tip = field[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        })
    }

    
    onChooseChange = value =>{
        this.setState({
            selectedSsid:value
        });
        
    }

    onDeselect = value =>{
        for(let i=0;i<this.weixin.ssidlist.length;i++){
            if(value == this.weixin.ssidlist[i].name){
                this.weixin.ssidlist[i].enable = "0";
            }
        }
    }

    onSelect = value =>{
        for(let i=0;i<this.weixin.ssidlist.length;i++){
            if(value == this.weixin.ssidlist[i].name){
                this.weixin.ssidlist[i].enable = "1";
            }
        }

    }

    async fetchWeChatAuthInfo(){
        let response = await common.fetchApi(
            [{
                opcode: 'AUTH_WEIXIN_CONFIG_GET',
            }]
            );
        let {errcode,data,message} = response;
        this.weixin =data[0].result.weixin;
        if(errcode == 0){
            this.setState({
                enable : this.weixin.enable == '1'? true : false,
                disableType :this.weixin.enable == '1'? false : true,
                onlineLimit : this.weixin.online_limit,
                idleLimit : this.weixin.idle_limit,
                logo : this.weixin.logo,
                welcome : this.weixin.welcome,
                loginHint : this.weixin.login_hint,
                statement : this.weixin.statement,
                ssid : this.weixin.ssid,
                shopId : this.weixin.shopid,
                appId : this.weixin.appid,
                secretKey : this.weixin.secretkey,
            });
            const childrenList = [];
            let selectedSsid = [];
            for (let i = 0; i < this.weixin.ssidlist.length; i++) {
                if(this.weixin.ssidlist[i].enable === '1'){
                    selectedSsid.push(this.weixin.ssidlist[i].name);
                }
                childrenList.push(<Option value={this.weixin.ssidlist[i].name} >{this.weixin.ssidlist[i].name}</Option>);    
            }
            this.setState({
                children: childrenList,
                selectedSsid: selectedSsid
            });
            return ;
        }
        Modal.error({title  : '微信认证的信息获取失败', content : message});
    }

    submit =async() =>{
        this.setState({ loading: true });
        this.weixin.enable = this.state.enable == true? '1' : '0';
        this.weixin.online_limit =this.state.onlineLimit;
        this.weixin.idle_limit = this.state.idleLimit;
        this.weixin.logo = this.state.logo;
        this.weixin.welcome = this.state.welcome;
        this.weixin.login_hint = this.state.loginHint;
        this.weixin.statement = this.state.statement;
        this.weixin.ssid = this.state.ssid;
        this.weixin.shopid = this.state.shopId;
        this.weixin.appid = this.state.appId;
        this.weixin.secretkey = this.state.secretKey;
        let response = await common.fetchApi(
            [{
                opcode: 'AUTH_WEIXIN_CONFIG_SET',
                data: {weixin : this.weixin}
            }]
        ).catch(ex => {});
        let {errcode,message} = response;
        if(errcode == '0'){
            this.setState({ loading: false });
            return ;
        }
        Modal.error({title : '微信认证信息设置失败',content : message});
        this.setState({ loading: false });
    }

    componentDidMount(){
        this.fetchWeChatAuthInfo();
    }

    render(){
        const { enable, onlineLimit, onlineLimitTip, idleLimit, idleLimitTip, selectedSsid, logo, logoTip, welcome, welcomeTip, loginHint, loginHintTip, statement,  statementTip, ssid, ssidTip, shopId, shopIdTip, appId, appIdTip, secretKey, secretKeyTip, children, disableType, loading } = this.state;
        
        return (
            <div className="auth">
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div className='left'>
                        <PanelHeader title = "功能设置" checkable={true} checked={enable} onChange={this.onEnableChange}/>
                        <label style={{marginTop:20}}>上网时长</label>
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" showErrorTip={onlineLimitTip} style={{ width : 320}}>
                                <Input type="text" maxLength={4} disabled={false} placeholder={'请输入上网时长'} disabled={disableType} value={onlineLimit} onChange={(value)=>this.onChange('onlineLimit',value)} />
                                <ErrorTip >{onlineLimitTip}</ErrorTip>
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <label>空闲断线</label>
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" showErrorTip={idleLimitTip} style={{ width : 320}}>
                                <Input type="text" maxLength={4} disabled={false} placeholder={'请输入空闲断线'} disabled={disableType} value={idleLimit} onChange={(value)=>this.onChange('idleLimit',value)} />
                                <ErrorTip >{idleLimitTip}</ErrorTip>
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <div style={{width:320,display:'flex',flexDirection:'column'}}>
                            <label>生效SSID</label>
                            <Choose Children={children} value={selectedSsid} disableType={disableType} onDeselect={this.onDeselect} onSelect={this.onSelect} onChooseChange={this.onChooseChange}/>
                        </div>
                        <PanelHeader title = "认证页面设置" checkable={false} />
                        <section className='twosection'>
                            <section>    
                                <Upload onChange={this.handleWeixinLogoChange} name='weixinLogo' fileList={this.state.weixinLogoFileList} data={{ opcode: '0x2086' }} action={__BASEAPI__} uploadTitle={'上传Logo图'} multiple={false} beforeUpload={this.beforeUpload}>
                                    <Button style={{width:130,marginTop:10,marginBottom:5}}>
                                        <Icon type="upload" /> 上传Logo图
                                    </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png</span>
                                <Upload onChange={this.handleWeixinBgChange} name='weixinBg'  fileList={this.state.weixinBgFileList} data={{ opcode: '0x2087' }}  action={__BASEAPI__} multiple={false} uploadTitle={'上传背景图'} beforeUpload={this.beforeUpload}>
                                    <Button style={{width:130,marginTop:10,marginBottom:5}}>
                                            <Icon type="upload" /> 上传背景图
                                        </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png</span>
                                <label style={{marginTop:20}}>Logo信息</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={logoTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={15} placeholder={'欢迎您'} disabled={false} value={logo} onChange={(value)=>this.onChange('logo',value)} />
                                        <ErrorTip >{logoTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~15个字符</span>
                                </div>
                                <label>欢迎信息</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={welcomeTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={30} placeholder={'欢迎使用微信连Wi-Fi'} disabled={false} value={welcome} onChange={(value)=>this.onChange('welcome',value)} />
                                        <ErrorTip >{welcomeTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~30个字符</span>
                                </div>
                                <label>登陆按钮提示文字</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={loginHintTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={15} placeholder={'一键打开微信连Wi-Fi'} disabled={false} value={loginHint} onChange={(value)=>this.onChange('loginHint',value)} />
                                        <ErrorTip >{loginHintTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~15个字符</span>
                                </div>
                                <label>版权声明</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={statementTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={30} placeholder={'由Sunmi为您提供Wi-Fi服务'} disabled={false} value={statement} onChange={(value)=>this.onChange('statement',value)} />
                                        <ErrorTip >{statementTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~30个字符</span>
                                </div>
                            </section>
                            <section>
                                <div style={{width:325,height:488,border:'1px solid grey',borderRadius:8,marginTop:25}}>

                                </div>
                            </section>                  
                        </section>
                        <PanelHeader title = "微信公众平台参数设置" checkable={false} />
                        <label>SSID</label>
                        <FormItem type="small" showErrorTip={ssidTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32}  placeholder={'请输入SSID'} disabled={false} value={ssid} onChange={(value)=>this.onChange('ssid',value)} />
                            <ErrorTip >{ssidTip}</ErrorTip>
                        </FormItem>
                        <label>ShopID</label>
                        <FormItem type="small" showErrorTip={shopIdTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} placeholder={'请输入ShopID'} disabled={false} value={shopId} onChange={(value)=>this.onChange('shopId',value)} />
                            <ErrorTip >{shopIdTip}</ErrorTip>
                        </FormItem>
                        <label>AppID</label>
                        <FormItem type="small" showErrorTip={appIdTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} placeholder={'请输入AppID'} disabled={false} value={appId} onChange={(value)=>this.onChange('appId',value)} />
                            <ErrorTip >{appIdTip}</ErrorTip>
                        </FormItem>
                        <label>SecretKey</label>
                        <FormItem type="small" showErrorTip={secretKeyTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} placeholder={'请输入SecretKey'} disabled={false} value={secretKey} onChange={(value)=>this.onChange('secretKey',value)} />
                            <ErrorTip >{secretKeyTip}</ErrorTip>
                        </FormItem>
                    </div>
                    <section className="weixin-auth-save">
                        <Button className="weixin-auth-button" type="primary" loading={loading} onClick={this.submit}>保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
}

const Choose = props =>{
        return (
        <div className="hide-input" style={{ padding: 0, position: 'relative' }} id="weixinSelectedSsidArea">
            <Select mode="multiple" style={{ width: '100%' }} onDeselect={props.onDeselect} disabled={props.disableType} onSelect={props.onSelect} value={props.value} onChange={props.onChooseChange} placeholder="&nbsp;请选择生效SSID" getPopupContainer={() => document.getElementById('weixinSelectedSsidArea')}>
                {props.Children}
            </Select>
        </div>)
};
