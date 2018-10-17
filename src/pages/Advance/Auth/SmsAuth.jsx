
import React from "react";
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import { Modal ,Select ,Button ,Radio, Upload, Icon,message} from 'antd';
const {FormItem,Input} = Form;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class SmsAuth extends React.Component{
    constructor(props){
        super(props);
    }
    
    state = {
        enable : false,
        onlineLimit : '',
        idleLimit : '',
        logo : '欢迎您',
        welcome : '欢迎使用微信连Wi-Fi',
        statement : '由Sunmi为您提供Wi-Fi服务',
        codeExpired : '',
        serverProvider : 'ali',
        accessKeyId : '',
        accessKeySecret : '',
        templateCode : '',
        signName : '',
        selectedSsid : [],
        children : [],
        watchValue : '1',
        fileList : []
    }

    handleWeChange = (info) => {
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        fileList = fileList.map((file) => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });

        fileList = fileList.filter((file) => {
          if (file.response) {
            return file.response.status === 'success';
          }
          return true;
        });
    
        this.setState({ fileList });
    }

    beforeUpload = (file) => {
        let isImage = file.type;
        if(isImage!='image/png'&&isImage!='image/jpeg'){    
        message.error('只能上传带.jpg、.png后缀的图片文件');
        }
        return isImage;
    }  


    onEnableChange = type =>{
        this.setState({
            enable : type,
            disableType:!type
        })
    }

    onChange = (name,value) =>{
        this.setState({
            [name] : value
        })
    }

    
    onChooseChange = value =>{
        this.setState({
            selectedSsid:value
        });
        
    }

    onDeselect = value =>{
        for(let i=0;i<this.sms.ssidlist.length;i++){
            if(value == this.sms.ssidlist[i].ssid){
                this.sms.ssidlist[i].enable = "0";
            }
        }
    }

    onSelect = value =>{
        for(let i=0;i<this.sms.ssidlist.length;i++){
            if(value == this.sms.ssidlist[i].ssid){
                this.sms.ssidlist[i].enable = "1";
            }
        }

    }

    onWatchValueChange = e =>{
        this.setState({
            watchValue : e.target.value
        })
        
    }

    async smsAuthInfo(){
        let response = await common.fetchWithCode('AUTH_SHORTMESSAGE_CONFIG_GET',{method : 'post'},{handleError : true});
        let {errcode,data,message} = response;
        if(errcode == 0){
            this.sms =data[0].result.sms;
            this.setState({
                enable : this.sms.enable == '1'? true : false,
                disableType :this.sms.enable == '1'? false : true,
                onlineLimit : this.sms.online_limit,
                idleLimit : this.sms.idle_limit,
                logo : this.sms.logo,
                welcome : this.sms.welcome,
                statement : this.sms.statement,
                codeExpired : this.sms.code_expired,
                serverProvider : this.sms.server_provider,
                accessKeyId :this.sms.access_key_id,
                accessKeySecret : this.sms.access_key_secret,
                templateCode : this.sms.template_code,
                signName : this.sms.sign_name,
            });
            this.sms.ssidlist =[
                {"ssid":"W1-Test-2.4G", "enable":"1"},
                {"ssid":"W1-Test-5G", "enable":"1"}
            ];
            for(let i= 0;i<this.sms.ssidlist.length;i++){
                this.sms.ssidlist[i].enable = "0";
            }
            const childrenList = [];
            for (let i = 0; i < this.sms.ssidlist.length; i++) {
                childrenList.push(<Option value={this.sms.ssidlist[i].ssid}>{this.sms.ssidlist[i].ssid}</Option>);
            }
            this.setState({children:childrenList});
            return ;
        }
        Modal.error({title  : '短信认证的信息获取失败', content : message});
    }

    submit = async() =>{
        this.sms.enable = this.state.enable == true? '1' : '0';
        this.sms.online_limit =this.state.onlineLimit;
        this.sms.idle_limit = this.state.idleLimit;
        this.sms.logo = this.state.logo;
        this.sms.welcome = this.state.welcome;
        this.sms.statement = this.state.statement;
        this.sms.code_expired = this.state.codeExpired;
        this.sms.server_provider = this.state.serverProvider;
        this.sms.access_key_id = this.state.accessKeyId;
        this.sms.access_key_secret = this.state.accessKeySecret;
        this.sms.template_code = this.state.templateCode;
        this.sms.sign_name = this.state.signName;
        let response = await common.fetchWithCode('AUTH_SHORTMESSAGE_CONFIG_SET',{method : 'post',data : {sms : this.sms}}).catch(ex => {});
        let {errcode,message} = response;
        if(errcode == '0'){
            return ;
        }
        Modal.error({title : '短信认证信息设置失败',content : message});
    }

    componentDidMount(){
        this.smsAuthInfo();
    }

    render(){
        const {enable,onlineLimit,idleLimit,selectedSsid,logo,welcome,statement,codeExpired,serverProvider,accessKeyId,accessKeySecret,templateCode,signName,children,disableType,watchValue} = this.state;
        
        return (
            <div className="auth">
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div className='left'>
                        <PanelHeader title = "功能设置" checkable={true} checked={enable} onChange={this.onEnableChange}/>
                        <label style={{marginTop:20}}>上网时长</label>
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="text" disabled={false} placeholder={'请输入上网时长'} disabled={disableType} value={onlineLimit} onChange={(value)=>this.onChange('onlineLimit',value)} />
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <label>空闲断线</label>
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="text" disabled={false} placeholder={'请输入空闲断线'} disabled={disableType} value={idleLimit} onChange={(value)=>this.onChange('idleLimit',value)} />
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <div style={{width:320,display:'flex',flexDirection:'column'}}>
                            <label>生效SSID</label>
                            <Choose Children={children} selectedSsid={selectedSsid} disableType={disableType} onDeselect={this.onDeselect} onSelect={this.onSelect} onChooseChange={this.onChooseChange}/>
                        </div>
                        <PanelHeader title = "认证页面设置" checkable={false} />
                        <section className='twosection'>
                            <section>    
                                <Upload onChange={this.handleWeChange} action="//192.168.100.1" fileList={this.state.fileList} multiple={false} uploadTitle={'上传Logo图'} beforeUpload={this.beforeUpload}>
                                    <Button style={{width:130}}>
                                        <Icon type="upload" /> 上传Logo图
                                    </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png；图片大小：</span>
                                <Upload  onChange={this.handleWeChange} action="//192.168.100.1" fileList={this.state.fileList} multiple={false} uploadTitle={'上传背景图'}>
                                    <Button style={{width:130}}>
                                            <Icon type="upload" /> 上传背景图
                                        </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png；图片大小：</span>
                                <label style={{marginTop:20}}>Logo信息</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" style={{ width : 320}}>
                                        <Input type="text" placeholder={'欢迎您'} disabled={false} value={logo} onChange={(value)=>this.onChange('logo',value)} />
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~15个字符</span>
                                </div>
                                <label>欢迎信息</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" style={{ width : 320}}>
                                        <Input type="text" placeholder={'欢迎使用微信连Wi-Fi'} disabled={false} value={welcome} onChange={(value)=>this.onChange('welcome',value)} />
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~30个字符</span>
                                </div>
                                <label>版权声明</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" style={{ width : 320}}>
                                        <Input type="text" placeholder={'由Sunmi为您提供Wi-Fi服务'} disabled={false} value={statement} onChange={(value)=>this.onChange('statement',value)} />
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~30个字符</span>
                                </div>
                            </section>
                            <section style={{display : 'flex',flexDirection : 'column'}}>
                            <RadioGroup onChange={this.onWatchValueChange} value={watchValue}>
                                <Radio style={{display:'inline-block',width:120}} value={'1'}>手机效果预览</Radio>
                                <Radio style={{display:'inline-block',width:120}} value={'2'}>网页效果预览</Radio>
                            </RadioGroup>
                            {(watchValue == '1')?
                                (
                                    <div style={{width:325,height:488,border:'1px solid grey',borderRadius:8,marginTop:20}}>

                                    </div>
                                ):(
                                    <div style={{width:467,height:262,border:'1px solid grey',borderRadius:8,marginTop:20}}>

                                    </div>
                                )
    
                            }
                            </section>                  
                        </section>
                        <PanelHeader title = "短信平台参数设置" checkable={false} />
                        <label>验证码有效期</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入验证码有效期'} disabled={false} value={codeExpired} onChange={(value)=>this.onChange('codeExpired',value)} />
                        </FormItem>
                        <label>短信服务商</label>
                        <div style={{marginBottom:24}}>
                            <Select style={{width : 320}} value={serverProvider} onChange={(value)=>this.onChange('serverProvider',value)} placeholder={'请选择短信服务商'}>
                                <Option value={'ali'}>阿里云</Option>
                            </Select>
                        </div>
                        <label>Access Key ID</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入Access Key ID'} disabled={false} value={accessKeyId} onChange={(value)=>this.onChange('accessKeyId',value)} />
                        </FormItem>
                        <label>Access Key Secret</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入Access Key Secret'} disabled={false} value={accessKeySecret} onChange={(value)=>this.onChange('accessKeySecret',value)} />
                        </FormItem>
                        <label>模版 Code</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入模版 Code'} disabled={false} value={templateCode} onChange={(value)=>this.onChange('templateCode',value)} />
                        </FormItem>
                        <label>签名名称</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" placeholder={'请输入签名名称'} disabled={false} value={signName} onChange={(value)=>this.onChange('signName',value)} />
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

const Choose = props =>{
        return (
        <div className="hide-input">
            <Select mode="multiple" style={{ width: '100%' }} onDeselect={props.onDeselect} disabled={props.disableType} onSelect={props.onSelect} value={props.selectedSsid} onChange={props.onChooseChange} placeholder="&nbsp;请选择生效SSID">
                {props.Children}
            </Select>
        </div>
        );
};
