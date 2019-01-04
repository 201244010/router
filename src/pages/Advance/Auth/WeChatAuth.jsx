
import React from "react";
import { Modal , Select, Button, Upload, Icon, message, Checkbox } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import { checkStr, checkRange } from '~/assets/common/check';
import WeChatPreview from "./WeChatPreview";


const { FormItem, Input, ErrorTip } = Form;
const Option = Select.Option;

export default class WeChatAuth extends React.Component{
    constructor(props){
        super(props);
    }
    
    state = {
        logo_img: '',
        bg_img: '',
        enable: false,
        onlineLimit: '',
        onlineLimitTip: '',
        idleLimit: '',
        idleLimitTip: '',
        logo: '',
        logoTip: '',
        welcome: '',
        welcomeTip: '',
        loginHint: '',
        loginHintTip: '',
        statement: '',
        statementTip: '',
        ssid: '',
        ssidTip: '',
        shopId:'',
        shopIdTip:'',
        appId: '',
        appIdTip: '',
        secretKey: '',
        secretKeyTip: '',
        //生效SSID Input 方式的字段
        selectedSsid: '',
        //生效SSID Select 方式的字段
        // selectedSsid: [],
        // children: [],
        weixinLogoFileList: [],
        weixinBgFileList: [],
        loading: false,
        saveDisabled: false
    }

    updateImg = async (key) => {
        let response = await common.fetchApi({ opcode: 'AUTH_WEIXIN_CONFIG_GET' });
        let { errcode, data } = response;
        if (errcode == 0) {
            const img = data[0].result.weixin[key];
            this.setState({
                [key]: `${img}?${Math.random()}`
            })
        }
    }
    
    handleUploadChange = (info, fileKey, imgKey) => {
        let fileList = info.fileList;

        // 1. Limit the number of uploaded files
        fileList = fileList.slice(-1);

        //2.Filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
            const type = file.type;
            return (type === 'image/png' || type === 'image/jpeg');
        });

        this.setState({ [fileKey]: fileList });

        const file = info.file;
        switch (file.status) {
            case 'done':
                if (0 === file.response.errcode) {
                    message.success('上传成功');
                    this.updateImg(imgKey);
                } else {
                    message.error('上传失败，请检查图片格式、大小是否符合要求');
                }
                break;
            case 'error':
                message.error('上传失败，请检查图片格式、大小是否符合要求');
                break;
        }
    }

    beforeUpload = (file) => {
        let type = file.type;
        if (type === "image/png" || type === "image/jpeg" ){
            return true;
        }

        message.error('只支持.jpg、.png后缀的图片');
        return false;
    }
    
    checkSaveDisabled = () => {
        const field = [ this.state.onlineLimit, this.state.idleLimit, this.state.logo, this.state.welcome, this.state.loginHint, this.state.statement, this.state.ssid, this.state.shopId, this.state.appId, this.state.secretKey];
        const fieldTip = [ this.state.onlineLimitTip, this.state.idleLimitTip, this.state.logoTip, this.state.welcomeTip, this.state.loginHintTip, this.state.statementTip, this.state.ssidTip, this.state.shopIdTip, this.state.appIdTip, this.state.secretKeyTip];
        if(this.state.enable === false ){
            this.setState({
                saveDisabled: field[0] === '' || field[1] === '' || fieldTip[0] !=='' || fieldTip[1] !== '',
            });
        }else{
            for(let i = 0; i < field.length; i++){
                if(field[i] === ''|| typeof(field[i]) === 'undefined' || fieldTip[i] !== ''){
                    this.setState({
                        saveDisabled: true
                    });
                    return ;
                }
            }
            this.setState({
                saveDisabled: false
            })
        }
    }

    onEnableChange = async (type) =>{
        if (true === type) {
            let resp = await common.fetchApi({ opcode: 'AUTH_SHORTMESSAGE_CONFIG_GET' });
            let { errcode, data } = resp;
            if (errcode == 0) {
                if ('1' === data[0].result.sms.enable) {
                    Modal.warning({
                        centered: true,
                        title: '提示',
                        content: '微信认证和短信认证不能同时开启，请先关闭短信认证',
                        okText: '确定'
                    });
                    return;
                }
            }
        }

        this.setState({
            enable: type,
            disableType: !type
        }, this.checkSaveDisabled);
    }

    onChange = (name,value) =>{
        const inputField = {
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
        const tip = inputField[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        },()=>{this.checkSaveDisabled()});
    }

    //生效SSID Select 方式的 函数
    // onChooseChange = value =>{
    //     this.setState({
    //         selectedSsid:value
    //     });
        
    // }

    // onDeselect = value =>{
    //     for(let i=0;i<this.weixin.ssidlist.length;i++){
    //         if(value == this.weixin.ssidlist[i].name){
    //             this.weixin.ssidlist[i].enable = "0";
    //         }
    //     }
    // }

    // onSelect = value =>{
    //     for(let i=0;i<this.weixin.ssidlist.length;i++){
    //         if(value == this.weixin.ssidlist[i].name){
    //             this.weixin.ssidlist[i].enable = "1";
    //         }
    //     }

    // }

    async fetchWeChatAuthInfo(){
        let response = await common.fetchApi(
            [{
                opcode: 'AUTH_WEIXIN_CONFIG_GET',
            }]
            );
        let { errcode,data } = response;
        this.weixin =data[0].result.weixin;
        if(errcode == 0){
            this.setState({
                enable : this.weixin.enable == '1'? true : false,
                disableType :this.weixin.enable == '1'? false : true,
                onlineLimit : this.weixin.online_limit,
                idleLimit : this.weixin.idle_limit,
                logo : this.weixin.logo_info,
                logo_img: `${this.weixin.logo_img}?${Math.random()}`,
                bg_img: `${this.weixin.bg_img}?${Math.random()}`,
                welcome : this.weixin.welcome,
                loginHint : this.weixin.login_hint,
                statement : this.weixin.statement,
                ssid : this.weixin.ssid,
                shopId : this.weixin.shopid,
                appId : this.weixin.appid,
                secretKey : this.weixin.secretkey,
                //input 方式的生效SSID赋值
                selectedSsid: this.weixin.ssidlist[0].name,
            },()=>{this.checkSaveDisabled()});
            //生效SSID 的 Input 方式,默认enable全部为 ‘1’
            for (let i = 0; i < this.weixin.ssidlist.length; i++) {
                this.weixin.ssidlist[i].enable = '1' ;
            }
            //生效SSID 的 Select 方式，下个版本会用，注释保留
            // const childrenList = [];
            // let selectedSsid = [];
            // for (let i = 0; i < this.weixin.ssidlist.length; i++) {
            //     if(this.weixin.ssidlist[i].enable === '1'){
            //         selectedSsid.push(this.weixin.ssidlist[i].name);
            //     }
            //     childrenList.push(<Option value={this.weixin.ssidlist[i].name} >{this.weixin.ssidlist[i].name}</Option>);    
            // }
            // this.setState({
            //     children: childrenList,
            //     selectedSsid: selectedSsid
            // });
            return ;
        }
        message.error(`微信认证信息获取失败[${errcode}]`);
    }

    dataSet = async() =>{
        this.weixin.enable = this.state.enable == true? '1' : '0';
        this.weixin.online_limit =this.state.onlineLimit;
        this.weixin.idle_limit = this.state.idleLimit;
        this.weixin.logo_info = this.state.logo;
        this.weixin.welcome = this.state.welcome;
        this.weixin.login_hint = this.state.loginHint;
        this.weixin.statement = this.state.statement;
        this.weixin.ssid = this.state.ssid;
        this.weixin.shopid = this.state.shopId;
        this.weixin.appid = this.state.appId;
        this.weixin.secretkey = this.state.secretKey;
        if(this.state.enable === true){
            common.fetchApi(
                [{
                    opcode: 'AUTH_ENABLE_MSG'
                }]
            );
        }
        let response = await common.fetchApi(
            [{
                opcode: 'AUTH_WEIXIN_CONFIG_SET',
                data: {weixin : this.weixin}
            }]
        ).catch(ex => {});
        let { errcode } = response;
        if(errcode == '0'){
            message.success(`配置生效`);
            this.setState({ loading: false });
            return ;
        }
        message.error(`配置失败![${errcode}]`);
        this.setState({ loading: false });
    }
    
    submit = async() =>{
        this.setState({ loading: true });
        if (true === this.state.enable) {
            let resp = await common.fetchApi({ opcode: 'AUTH_SHORTMESSAGE_CONFIG_GET' });
            let { errcode, data } = resp;
            if (errcode == 0) {
                if ('1' === data[0].result.sms.enable) {
                    Modal.warning({
                        centered: true,
                        title: '提示',
                        content: '微信认证和短信认证不能同时开启，请先关闭短信认证',
                        okText: '确定'
                    });
                    this.setState({ loading: false });
                    return;
                }
            }
        }
        if(this.state.enable === true){
            Modal.confirm({
                title: '提示',
                content: '微信认证开启后，会自动开启客用Wi-Fi，并清空密码，确定继续？',
                onOk:this.dataSet,
                onCancel(){},
                cancelText: '取消',
                okText: '确定',
                centered: true    
            });
            this.setState({ loading: false });
        }else{
            this.dataSet();
        }
    }

    componentDidMount(){
        this.fetchWeChatAuthInfo();
    }

    render(){
        const { bg_img, logo_img, enable, onlineLimit, onlineLimitTip, idleLimit, idleLimitTip, selectedSsid, logo, logoTip, welcome, welcomeTip, loginHint, loginHintTip, statement,  statementTip, ssid, ssidTip, shopId, shopIdTip, appId, appIdTip, secretKey, secretKeyTip, children, disableType, loading, saveDisabled } = this.state;
        
        return (
            <div className="auth">
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div className='left'>
                        <PanelHeader
                            title="功能设置"
                            tip={
                                <div className='help-content'>
                                    <p>微信认证是微信推出的快速连接Wi-Fi热点的功能。启用后，顾客仅需通过微信“扫一扫”二维码或者通过手动选择SSID后、再在弹出的认证页面进行后续操作，即可快速连接Wi-Fi免费上网</p>
                                    <p>提示：受限于手机系统差异，部分用户连接Wi-Fi后，如果无法第一时间弹出认证弹窗，可尝试打开手机浏览器，手动输入“http://sunmi.com”进行认证</p>
                                </div>}
                            checkable={true}
                            checked={enable}
                            onChange={this.onEnableChange}
                        />
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
                                <Upload
                                    onChange={(file) => {
                                        this.handleUploadChange(file, 'weixinLogoFileList', 'logo_img');
                                    }}
                                    name='file'
                                    fileList={this.state.weixinLogoFileList}
                                    data={{ opcode: '0x2086' }}
                                    action={__BASEAPI__}
                                    uploadTitle={'上传Logo图'}
                                    multiple={false}
                                    beforeUpload={this.beforeUpload}
                                >
                                    <Button style={{width:130,marginTop:20,marginBottom:5}}>
                                        <Icon type="upload" />上传Logo图
                                    </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png；最大上传大小：128KB</span>
                                <Upload
                                    onChange={(file) => {
                                        this.handleUploadChange(file, 'weixinBgFileList', 'bg_img');
                                    }}
                                    name='file'
                                    fileList={this.state.weixinBgFileList}
                                    data={{ opcode: '0x2087' }}
                                    action={__BASEAPI__}
                                    multiple={false}
                                    uploadTitle={'上传背景图'}
                                    beforeUpload={this.beforeUpload}
                                >
                                    <Button style={{width:130,marginTop:10,marginBottom:5}}>
                                        <Icon type="upload" />上传背景图
                                    </Button>
                                </Upload>
                                <span>支持扩展名：.jpg .png；最大上传大小：512KB</span>
                                <label style={{marginTop:20}}>Logo信息</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={logoTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={15} placeholder={'请输入Logo信息'} disabled={false} value={logo} onChange={(value)=>this.onChange('logo',value)} />
                                        <ErrorTip >{logoTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,
                                    color:'#ADB1B9'}}>1~15个字符</span>
                                </div>
                                <label>欢迎信息</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={welcomeTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={30} placeholder={'请输入欢迎信息'} disabled={false} value={welcome} onChange={(value)=>this.onChange('welcome',value)} />
                                        <ErrorTip >{welcomeTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,
                                    color:'#ADB1B9'}}>1~30个字符</span>
                                </div>
                                <label>登录按钮提示文字</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={loginHintTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={15} placeholder={'请输入登陆按钮提示文字'} disabled={false} value={loginHint} onChange={(value)=>this.onChange('loginHint',value)} />
                                        <ErrorTip >{loginHintTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,
                                    color:'#ADB1B9'}}>1~15个字符</span>
                                </div>
                                <label>版权声明</label>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <FormItem type="small" showErrorTip={statementTip} style={{ width : 320}}>
                                        <Input type="text" maxLength={30} placeholder={'请输入版权声明'} disabled={false} value={statement} onChange={(value)=>this.onChange('statement',value)} />
                                        <ErrorTip >{statementTip}</ErrorTip>
                                    </FormItem>
                                    <span style={{height:40,lineHeight:'40px',marginLeft:5,marginBottom:0,zIndex:1,
                                    color:'#ADB1B9'}}>1~30个字符</span>
                                </div>
                            </section>
                            <section>
                                <WeChatPreview
                                    style={{marginTop:20}}
                                    BgImage={bg_img}
                                    logoImage={logo_img}
                                    logo={logo}
                                    welcome={welcome}
                                    buttonInfo={loginHint}
                                    statement={statement}
                                />
                            </section>                  
                        </section>
                        <PanelHeader
                            title = "微信公众平台参数设置"
                            tip='设置之前，请先登录微信公众平台官网注册相关门店，注册成功后，微信公众平台会提供一系列参数（SSID、ShopID、AppID、Secretkey），将其复制到此页面对应的输入框中'
                            checkable={false}
                        />
                        <label style={{marginTop:20}}>SSID</label>
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
                        <FormItem type="small" showErrorTip={secretKeyTip} style={{ width : 320, marginBottom: 0}}>
                            <Input type="text" maxLength={32} placeholder={'请输入SecretKey'} disabled={false} value={secretKey} onChange={(value)=>this.onChange('secretKey',value)} />
                            <ErrorTip >{secretKeyTip}</ErrorTip>
                        </FormItem>
                    </div>   
                </Form>
                <section className="save">
                    <Button className="weixin-auth-button" type="primary" size="large" style={{ width: 320 }} 
                    loading={loading} disabled={saveDisabled} onClick={this.submit}>保存</Button>
                </section>
            </div>
        );
    }
}

//生效SSID 的 Select 方式，下个版本会用，注释保留
// const Choose = props =>{
//         return (
//         <div className="hide-input" style={{ padding: 0, position: 'relative' }} id="weixinSelectedSsidArea">
//             <Select mode="multiple" style={{ width: '100%' }} onDeselect={props.onDeselect} disabled={props.disableType} onSelect={props.onSelect} value={props.value} onChange={props.onChooseChange} placeholder="&nbsp;请选择生效SSID" getPopupContainer={() => document.getElementById('weixinSelectedSsidArea')}>
//                 {props.Children}
//             </Select>
//         </div>)
// };
