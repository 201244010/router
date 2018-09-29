
import React from "react";
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import { Modal ,Select,Upload, message, Button, Icon } from 'antd';


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
        ],
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
                ssidList : this.weixin.ssidlist,
            });
            return ;
        }
        Modal.error({title  : '微信认证的信息获取失败', content : message});
    }

    componentDidMount(){
        this.fetchWeChatAuthInfo();
    }

    render(){
        const props = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            disabled:false,
            showUploadList : true,
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
                return;
              }
              if (info.file.status === 'done') {
                message.success('${info.file.name} file uploaded successfully');
                return;
              } else if (info.file.status === 'error') {
                message.error('${info.file.name} file upload failed.');
                return;
              }
              this.setState({disabled : false});
            },
            beforeUpload(file){
                const isImage = file.type ==='image/png'||'image/jpg';
                if(!isImage){
                    message.error('只能上传带.jpg、.png后缀的图片文件');
                }
                return isImage;
            }
          };
        
        const {enable,onlineLimit,idleLimit,selectedSsid,logo,welcome,loginHint,statement,ssid,shopId,appId,secretKey,ssidList} = this.state;
        const ssidListOption = ssidList.map(ssidOption =><Option key ={ssidOption.ssid}>{ssidOption.ssid}</Option>);
        return (
            <div className="auth">
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div className='left'>
                        <PanelHeader title = "功能设置" checkable={true} checked={enable} onChange={this.onEnableChange}/>
                        <label style={{marginTop:20}}>上网时长</label>
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="text" disabled={false} placeholder={'请输入上网时长'} value={onlineLimit} onChange={(value)=>this.onChange('onlineLimit',value)} />
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <label>空闲断线</label>
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="text" disabled={false} placeholder={'请输入空闲断线'} value={idleLimit} onChange={(value)=>this.onChange('idleLimit',value)} />
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <div style={{display:'flex',flexDirection:'column'}}>
                            <label>生效SSID</label>
                            <Select style={{width:320}} placeholder={'请选择生效SSID'}>{ssidListOption}</Select>
                        </div>
                        <PanelHeader title = "认证页面设置" checkable={false} />
                        <section className='twosection'>
                            <section>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <Upload {...props}>
                                        <Button style={{width:150,marginTop:15,marginBottom:3}}>
                                        <Icon type="upload" /> 上传Logo图片
                                        </Button>
                                    </Upload>
                                </div>
                                <span>支持扩展名：.jpg .png；图片大小：</span>
                                <Upload {...props}>
                                    <Button style={{width:150,marginTop:15,marginBottom:3}}>
                                    <Icon type="upload" /> 上传背景图片
                                    </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png；图片大小：</span>
                                <label style={{marginTop:20}}>Logo信息</label>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="text" placeholder={'欢迎您'} disabled={false} value={logo} onChange={(value)=>this.onChange('logo',value)} />
                                </FormItem>
                                <label>欢迎信息</label>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="text" placeholder={'欢迎使用微信连Wi-Fi'} disabled={false} value={welcome} onChange={(value)=>this.onChange('welcome',value)} />
                                </FormItem>
                                <label>登陆按钮提示文字</label>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="text" placeholder={'一键打开微信连Wi-Fi'} disabled={false} value={loginHint} onChange={(value)=>this.onChange('loginHint',value)} />
                                </FormItem>
                                <label>版权声明</label>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="text" placeholder={'由Sunmi为您提供Wi-Fi服务'} disabled={false} value={statement} onChange={(value)=>this.onChange('statement',value)} />
                                </FormItem>
                            </section>
                            <section>
                                <div>

                                </div>
                            </section>                  
                        </section>
                        <PanelHeader title = "微信公众平台参数设置" checkable={false} />
                        <label>SSID</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入SSID'} disabled={false} value={ssid} onChange={(value)=>this.onChange('ssid',value)} />
                        </FormItem>
                        <label>ShopID</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入ShopID'} disabled={false} value={shopId} onChange={(value)=>this.onChange('shopId',value)} />
                        </FormItem>
                        <label>AppID</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入AppID'} disabled={false} value={appId} onChange={(value)=>this.onChange('appId',value)} />
                        </FormItem>
                        <label>SecretKey</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入SecretKey'} disabled={false} value={secretKey} onChange={(value)=>this.onChange('secretKey',value)} />
                        </FormItem>
                    </div>
                    <section className="weixin-auth-save">
                        <Button className="weixin-auth-button" type="primary" onClick={this.submit}>保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
}