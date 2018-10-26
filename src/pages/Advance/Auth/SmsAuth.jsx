
import React from "react";
import { Modal ,Select ,Button ,Radio, Upload, Icon,message} from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import { checkStr, checkRange } from '~/assets/common/check';

const { FormItem, Input, ErrorTip } = Form;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class SmsAuth extends React.Component{
    constructor(props){
        super(props);
    }
    
    state = {
        enable : false,
        onlineLimit: '',
        onlineLimitTip: '',
        idleLimit: '',
        idleLimitTip: '',
        logo: '',
        logoTip: '',
        welcome: '',
        welcomeTip: '',
        statement: '',
        statementTip: '',
        codeExpired: '',
        codeExpiredTip: '',
        serverProvider: 'ali',
        accessKeyId: '',
        accessKeyIdTip: '',
        accessKeySecret: '',
        accessKeySecretTip: '',
        templateCode: '',
        templateCodeTip: '',
        signName: '',
        signNameTip: '',
        //生效SSID Input 方式的字段
        selectedSsid: '',
        //生效SSID Select 方式的字段
        // selectedSsid: [],
        // children: [],
        watchValue: '1',
        smsLogoFileList: [],
        smsBgFileList: [],
        loading: false
    }

    handleSmsLogoChange = (info) => {
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
        this.setState({ smsLogoFileList: fileList });
    }

    handleSmsBgChange = (info) => {
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
        this.setState({ smsBgFileList: fileList });
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
        });
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
            statement:{
                func: checkStr(value, { who: '版权声明', min: 1, max: 30 })
            },
            codeExpired:{
                func: checkRange(value, { min: 30,max: 300,who: '验证码有效期' })
            },
            accessKeyId:{
                func: checkStr(value, { who: 'Access Key ID', min: 1, max: 32, type: 'english' })
            },
            accessKeySecret:{
                func: checkStr(value, { who: 'Access Key Secret', min: 1, max: 32, type: 'english' })
            },
            templateCode:{
                func: checkStr(value, { who: '模板 Code', min: 1, max: 32, type: 'english' })
            },
            signName:{
                func: checkStr(value, { who: '签名名称', min: 1, max: 32 })
            }
        };
        const tip = field[name].func;
        this.setState({
            [name] : value,
            [name + 'Tip']: tip 
        });
    }

    onSelectChange = (name, value) =>{
        this.setState({
            [name]: value
        });
    }

    //生效SSID 的 Select 方式，下个版本会用，注释保留
    // onChooseChange = value =>{
    //     this.setState({
    //         selectedSsid:value
    //     });
        
    // }

    // onDeselect = value =>{
    //     for(let i=0;i<this.sms.ssidlist.length;i++){
    //         if(value == this.sms.ssidlist[i].name){
    //             this.sms.ssidlist[i].enable = "0";
    //         }
    //     }
    // }

    // onSelect = value =>{
    //     for(let i=0;i<this.sms.ssidlist.length;i++){
    //         if(value == this.sms.ssidlist[i].name){
    //             this.sms.ssidlist[i].enable = "1";
    //         }
    //     }

    // }

    onWatchValueChange = e =>{
        this.setState({
            watchValue : e.target.value
        });
        
    }

    async smsAuthInfo(){
        let response = await common.fetchApi(
            [{
                opcode: 'AUTH_SHORTMESSAGE_CONFIG_GET'
            }]
        );
        let {errcode,data,message} = response;
        if(errcode == 0){
            this.sms =data[0].result.sms;
            this.setState({
                enable : this.sms.enable == '1'? true : false,
                disableType :this.sms.enable == '1'? false : true,
                onlineLimit : this.sms.online_limit,
                idleLimit : this.sms.idle_limit,
                logo : this.sms.logo_info,
                welcome : this.sms.welcome,
                statement : this.sms.statement,
                codeExpired : this.sms.code_expired,
                serverProvider : this.sms.server_provider,
                accessKeyId :this.sms.access_key_id,
                accessKeySecret : this.sms.access_key_secret,
                templateCode : this.sms.template_code,
                signName : this.sms.sign_name,
                //input 方式的生效SSID赋值
                selectedSsid: this.sms.ssidlist[0].name,
            });

            //生效SSID 的 Input 方式,默认enable全部为 ‘1’
            for (let i = 0; i < this.sms.ssidlist.length; i++) {
                this.sms.ssidlist[i].enable = '1' ;
            }

            //生效SSID 的 Select 方式，下个版本会用，注释保留
            // const childrenList = [];
            // let selectedSsid = [];
            // for (let i = 0; i < this.sms.ssidlist.length; i++) {
            //     if(this.sms.ssidlist[i].enable === '1'){
            //         selectedSsid.push(this.sms.ssidlist[i].name);
            //     }
            //     childrenList.push(<Option value={this.sms.ssidlist[i].name} >{this.sms.ssidlist[i].name}</Option>);    
            // }
            // this.setState({
            //     children: childrenList,
            //     selectedSsid: selectedSsid
            // });
            return ;
        }
        Modal.error({title  : '短信认证的信息获取失败', content : message});
    }

    submit = async() =>{
        this.setState({ loading: true });
        this.sms.enable = this.state.enable == true? '1' : '0';
        this.sms.online_limit =this.state.onlineLimit;
        this.sms.idle_limit = this.state.idleLimit;
        this.sms.logo_info = this.state.logo;
        this.sms.welcome = this.state.welcome;
        this.sms.statement = this.state.statement;
        this.sms.code_expired = this.state.codeExpired;
        this.sms.server_provider = this.state.serverProvider;
        this.sms.access_key_id = this.state.accessKeyId;
        this.sms.access_key_secret = this.state.accessKeySecret;
        this.sms.template_code = this.state.templateCode;
        this.sms.sign_name = this.state.signName;
        let response = await common.fetchApi(
            [{
                opcode: 'AUTH_SHORTMESSAGE_CONFIG_SET',
                data: {sms : this.sms}
            }]
        ).catch(ex => {});
        let {errcode,message} = response;
        if(errcode == '0'){
            this.setState({ loading: false });
            return ;
        }
        Modal.error({title : '短信认证信息设置失败',content : message});
        this.setState({ loading: false });
    }

    componentDidMount(){
        this.smsAuthInfo();
    }

    render(){
        const { enable, onlineLimit, onlineLimitTip, idleLimit, idleLimitTip, selectedSsid, logo, logoTip, welcome, welcomeTip, statement, statementTip, codeExpired, codeExpiredTip, serverProvider, accessKeyId, accessKeyIdTip, accessKeySecret, accessKeySecretTip, templateCode, templateCodeTip, signName, signNameTip, children, disableType, watchValue, loading } = this.state;
        
        return (
            <div className="auth">
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div className='left'>
                        <PanelHeader title = "功能设置" checkable={true} checked={enable} onChange={this.onEnableChange}/>
                        <label style={{marginTop:20}}>上网时长</label>
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" showErrorTip={onlineLimitTip} style={{ width : 320}}>
                                <Input type="text" maxLength={4} disabled={false} placeholder={'请输入上网时长'} disabled={disableType} value={onlineLimit} onChange={(value)=>this.onChange('onlineLimit',value)} />
                                <ErrorTip>{onlineLimitTip}</ErrorTip>
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <label>空闲断线</label>
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" showErrorTip={idleLimitTip} style={{ width : 320}}>
                                <Input type="text" maxLength={4} disabled={false} placeholder={'请输入空闲断线'} disabled={disableType} value={idleLimit} onChange={(value)=>this.onChange('idleLimit',value)} />
                                <ErrorTip>{idleLimitTip}</ErrorTip>
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <label>生效SSID</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" disabled={true} value={selectedSsid}/>
                        </FormItem>
                        {/* 生效SSID 的 Select 方式，下个版本会用，注释保留 */}
                        {/* <div style={{width:320,display:'flex',flexDirection:'column'}}>
                            <label>生效SSID</label>
                            <Choose Children={children} value={selectedSsid} disableType={disableType} onDeselect={this.onDeselect} onSelect={this.onSelect} onChooseChange={this.onChooseChange}/>
                        </div> */}
                        <PanelHeader title = "认证页面设置" checkable={false} />
                        <section className='twosection'>
                            <section>    
                                <Upload onChange={this.handleSmsLogoChange} name='smsLogo' data={{ opcode: '0x2089' }} action={__BASEAPI__} fileList={this.state.smsLogoFileList} multiple={false} uploadTitle={'上传Logo图'} beforeUpload={this.beforeUpload}>
                                    <Button style={{width:130,marginTop:10,marginBottom:5}}>
                                        <Icon type="upload" /> 上传Logo图
                                    </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png</span>
                                <Upload  onChange={this.handleSmsBgChange} name='smsBg' data={{ opcode: '0x2085' }} action={__BASEAPI__} fileList={this.state.smsBgFileList} multiple={false} uploadTitle={'上传背景图'} beforeUpload={this.beforeUpload}>
                                    <Button style={{width:130,marginTop:10,marginBottom:5}}>
                                            <Icon type="upload" /> 上传背景图
                                        </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png</span>
                                <label style={{marginTop:20}}>Logo信息</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={logoTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={15} placeholder={'欢迎您'} disabled={false} value={logo} onChange={(value)=>this.onChange('logo',value)} />
                                        <ErrorTip>{logoTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~15个字符</span>
                                </div>
                                <label>欢迎信息</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={welcomeTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={30} placeholder={'欢迎使用微信连Wi-Fi'} disabled={false} value={welcome} onChange={(value)=>this.onChange('welcome',value)} />
                                        <ErrorTip>{welcomeTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,opacity:0.5}}>1~30个字符</span>
                                </div>
                                <label>版权声明</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={statementTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={30} placeholder={'由Sunmi为您提供Wi-Fi服务'} disabled={false} value={statement} onChange={(value)=>this.onChange('statement',value)} />
                                        <ErrorTip>{statementTip}</ErrorTip>
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
                        <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" showErrorTip={codeExpiredTip} style={{ width : 320}}>
                                <Input type="text" maxLength={3} placeholder={'请输入验证码有效期'} disabled={false} value={codeExpired} onChange={(value)=>this.onChange('codeExpired',value)} />
                                <ErrorTip>{codeExpiredTip}</ErrorTip>
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-40,marginBottom:0,zIndex:1,opacity:0.5}}>分钟</span>
                        </div>
                        <label>短信服务商</label>
                        <div style={{marginBottom:24}}>
                            <Select style={{width : 320}} value={serverProvider} onChange={(value)=>this.onSelectChange('serverProvider',value)} placeholder={'请选择短信服务商'}>
                                <Option value={'ali'}>阿里云</Option>
                            </Select>
                        </div>
                        <label>Access Key ID</label>
                        <FormItem type="small" showErrorTip={accessKeyIdTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} placeholder={'请输入Access Key ID'} disabled={false} value={accessKeyId} onChange={(value)=>this.onChange('accessKeyId',value)} />
                            <ErrorTip>{accessKeyIdTip}</ErrorTip>
                        </FormItem>
                        <label>Access Key Secret</label>
                        <FormItem type="small" showErrorTip={accessKeySecretTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} placeholder={'请输入Access Key Secret'} disabled={false} value={accessKeySecret} onChange={(value)=>this.onChange('accessKeySecret',value)} />
                            <ErrorTip>{accessKeySecretTip}</ErrorTip>
                        </FormItem>
                        <label>模版 Code</label>
                        <FormItem type="small" showErrorTip={templateCodeTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} placeholder={'请输入模版 Code'} disabled={false} value={templateCode} onChange={(value)=>this.onChange('templateCode',value)} />
                            <ErrorTip>{templateCodeTip}</ErrorTip>
                        </FormItem>
                        <label>签名名称</label>
                        <FormItem type="small" showErrorTip={signNameTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} placeholder={'请输入签名名称'} disabled={false} value={signName} onChange={(value)=>this.onChange('signName',value)} />
                            <ErrorTip>{signNameTip}</ErrorTip>
                        </FormItem>
                    </div>
                    <section className="weixin-auth-save">
                        <Button className="weixin-auth-button" loading={loading} type="primary" onClick={this.submit}>保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
}

//生效SSID 的 Select 方式，下个版本会用，注释保留
// const Choose = props =>{
//         return (
//         <div className="hide-input" style={{ padding: 0, position: 'relative' }} id="smsSelectedSsidArea">
//             <Select mode="multiple" style={{ width: '100%' }} onDeselect={props.onDeselect} disabled={props.disableType} onSelect={props.onSelect} value={props.value} onChange={props.onChooseChange} placeholder="&nbsp;请选择生效SSID" getPopupContainer={() => document.getElementById('smsSelectedSsidArea')}>
//                 {props.Children}
//             </Select>
//         </div>
//         );
// };
