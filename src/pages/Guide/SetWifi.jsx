
import React from 'react';
import { Button, Switch, Modal, Icon, message } from 'antd';
import { Base64 } from 'js-base64';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import Tips from '~/components/Tips';
import {checkStr} from '~/assets/common/check';

const { FormItem, Input, ErrorTip } = Form;
const confirm = Modal.confirm;
const errorMessage = {
    '-1001': '参数格式错误',
    '-1002': '参数非法',
    '-1100': 'Wi-Fi名称非法',
    '-1101': 'Wi-Fi密码非法'
};

export default class SetWifi extends React.Component {
    constructor(props){
        super(props); 
        this.tick = 1;   
    }

    state = {
        guestWifi : false,
        loading : false,
        done : true,
        visibile: 'hidden',
        hostWifiName : '',
        hostWifiPsw : '',
        guestWifiName : '',
        guestWifiPsw : '',
        hostWifiNameTip: '',
        hostWifiPswTip: '',
        guestWifiNameTip: '',
        guestWifiPswTip: '',
        canSubmit : false
    };

    back = ()=>{
        this.props.history.push("/guide/speed");
    };

    openGuestSetting = value => {
        if ( false === value){
            this.setState({
                guestWifi : value,
                guestWifiNameTip: '',
                guestWifiPswTip: '',
            }, () => {
                this.setState({ canSubmit : this.valid() });
            });
        }else{
            if(this.state.guestWifiPsw.length === 0){
                this.setState({
                    guestWifi : value,
                    guestWifiNameTip: checkStr(this.state.guestWifiName, { who: 'Wi-Fi名称', min: 1, max: 32, type: 'all' }),
                    guestWifiPswTip: '',
                }, () => {
                    this.setState({ canSubmit : this.valid() });
                });
            }else{
                this.setState({
                    guestWifi : value,
                    guestWifiNameTip: checkStr(this.state.guestWifiName, { who: 'Wi-Fi名称', min: 1, max: 32, type: 'all' }),
                    guestWifiPswTip: checkStr(this.state.guestWifiPsw, { who: 'Wi-Fi密码', min: 8, max: 32, type: 'english' }),
                }, () => {
                    this.setState({ canSubmit : this.valid() });
                });
            }    
        }
    }

    handleChange = (value, field) => {
        const type = {
            hostWifiName: {
                tip: checkStr(value, { who: 'Wi-Fi名称', min: 1, max: 32, type: 'all' })
            }, 
            hostWifiPsw: {
                tip: checkStr(value, { who: 'Wi-Fi密码', min: 8, max: 32, type: 'english' })
            }, 
            guestWifiName: {
                tip: checkStr(value, { who: 'Wi-Fi名称', min: 1, max: 32, type: 'all' })
            }, 
            guestWifiPsw: {
                tip: checkStr(value, { who: 'Wi-Fi密码', min: 8, max: 32, type: 'english' })
            }
        }
        if(value.length === 0 && (field === 'hostWifiPsw' || field === 'guestWifiPsw')){
            this.setState({
                [field]: value,
                [field + 'Tip']: ''
            },()=>{
                this.setState({ canSubmit : this.valid() });
            });
        }else{
            this.setState({ 
                [field] : value, 
                [field+'Tip']: type[field].tip 
            }, ()=>{
                this.setState({ canSubmit : this.valid() });
            });
        }   
    }

    dataSet = async() =>{
        this.mainWireLess.host.band_2g.ssid = this.state.hostWifiName;
        this.mainWireLess.host.band_2g.password = Base64.encode(this.state.hostWifiPsw);
        this.mainWireLess.host.band_5g.ssid = this.state.hostWifiName.substring(0,29) + '_5G';
        this.mainWireLess.host.band_5g.password = Base64.encode(this.state.hostWifiPsw);
        this.guestWireLess.ssid = this.state.guestWifiName;
        this.guestWireLess.static_password = Base64.encode(this.state.guestWifiPsw);
        this.guestWireLess.enable = this.state.guestWifi === false ? '0' : '1';
        this.mainWireLess.host.band_2g.encryption= this.state.hostWifiPsw.length === 0 ?'none':'psk-mixed/ccmp+tkip';
        this.mainWireLess.host.band_5g.encryption=this.state.hostWifiPsw.length === 0 ?'none':'psk-mixed/ccmp+tkip';
        this.guestWireLess.encryption=this.state.guestWifiPsw.length === 0 ? 'none':'psk-mixed/ccmp+tkip';
        this.mainWireLess.host.band_2g.enable = "1";

        let response = await common.fetchApi(
            [{
                opcode: 'WIRELESS_SET',
                data: { main : this.mainWireLess, guest : this.guestWireLess}
            }]
        ).catch(ex => {});

        this.setState({ loading : false});
        
        let {errcode} = response;
        if(errcode === 0){
            this.setState({
                visibile: 'visible',
                done: false,
            });
            setTimeout(async() => {
                await common.fetchApi(
                    [{
                        opcode: 'WIRELESS_GET',
                    }]
                ).catch(ex => {
                    if(ex !== ''){
                        this.setState({done: true});  
                    }}).then(
                            async()=>{
                            await common.fetchApi(
                                [{
                                    opcode: 'WIRELESS_GET',
                                }], 
                                {},
                                {
                                    loop: true,
                                    interval: 500,
                                    stop: resp => {resp!== 0},
                                }
                            );
                            this.props.history.push("/home");
                        }
                    );
            }, 7000);
            return ;
        }
        message.error(`Wi-Fi设置失败[${errorMessage[errcode] || errcode}]`);
    }

    submit = async ()=> {
        this.setState({ loading : true });
        if(this.state.hostWifiPsw.length === 0 || (this.state.guestWifi ? this.state.guestWifiPsw.length === 0 : false)){
            confirm({
                title: '提示：',
                content: (this.state.hostWifiPsw.length === 0 ?'商户Wi-Fi' : '') + 
                (this.state.hostWifiPsw.length === 0 && this.state.guestWifi && this.state.guestWifiPsw.length === 0 ? '、' : '')+
                (this.state.guestWifi ? (this.state.guestWifiPsw.length === 0 ? '顾客Wi-Fi':'') : '') +'密码未设置，确定继续?' ,
                onOk: this.dataSet,
                onCancel(){   

                },
                cancelText: '取消',
                okText: '确定',
                centered: true
            });
            this.setState({ loading : false }); 
        }else{
            this.dataSet();
        }       
    }

    format = ()=>{
        return this.tick + 'S';
    }

    valid(){
        let ret = true;
        let { guestWifi, hostWifiName, hostWifiPsw, hostWifiPswTip, guestWifiName, guestWifiPsw, guestWifiPswTip } = this.state;

        if( hostWifiName.length === 0 || guestWifiPswTip !== '' || (hostWifiPsw.trim() === ''&& hostWifiPsw.length !== 0)){
            ret = false;
        }
        
        if(guestWifi){    
            if( guestWifiName.length === 0 || hostWifiPswTip !== '' || (guestWifiPsw.trim() === '' && guestWifiPsw.length !== 0)){
                ret = false;
            }
            if(guestWifiName === hostWifiName){
                ret = false;
                this.setState({
                    guestWifiNameTip: '商户、顾客Wi-Fi 不能相同',
                });
            }
        }
        return ret;
    }

    async fetchWireLessInfo(){
        let response = await common.fetchApi({ opcode: 'WIRELESS_GET' });
        let { errcode, data } = response;
        if(errcode == 0){
            let { main, guest } = data[0].result;
            this.mainWireLess = main;
            this.hostWireLess = main.host.band_2g;
            this.guestWireLess = guest;
            this.setState({
                hostWifiName : this.hostWireLess.ssid,
                hostWifiPsw : Base64.decode(this.hostWireLess.password),
                guestWifiName : this.guestWireLess.ssid,
                guestWifi : this.guestWireLess.enable !== '0',
                guestWifiPsw : Base64.decode(guest.static_password)   
            }, () => {
                this.setState({canSubmit : this.valid()})
            });
            return;
        }
        message.error(`Wi-Fi信息获取失败[${errcode}]`);
    }

    componentDidMount(){
        this.fetchWireLessInfo();
    }

    componentWillUnmount(){
        this.stop = true;
    }

    render(){
        const { guestWifi, hostWifiName, hostWifiPsw, guestWifiName, guestWifiPsw, canSubmit,hostWifiNameTip,hostWifiPswTip,guestWifiNameTip,guestWifiPswTip } = this.state;
        return (
            <div className="setwifi">
                <h2>设置无线网络</h2> 
                <p className="ui-tips guide-tip">顾客Wi-Fi可开放给客人使用，保障隐私安全 </p>
                <div className="wifi-box ui-relative ui-center">
                    <Form>
                        <div className='content'>
                            <CustomIcon style={{position: 'absolute', left: '-28px'}} size={20} type="business"></CustomIcon>
                            <tr style={{marginBottom: 20}}>
                                <th colSpan={2}><label>商户Wi-Fi<span>（建议店内设备和店员使用）</span></label></th>
                            </tr>
                            <tr>
                                <td><label>Wi-Fi名称</label></td>
                                <td>
                                    <FormItem>
                                        <Input value={hostWifiName} maxLength={32} type="text" placeholder="请输入Wi-Fi名称" onChange={value => this.handleChange(value, 'hostWifiName')} />
                                        <ErrorTip style={{color:'#fb8632'}}>{hostWifiNameTip}</ErrorTip>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Wi-Fi密码</label></td>
                                <td>
                                    <FormItem>
                                        <Input value={hostWifiPsw} maxLength={32} type="password" placeholder="请输入Wi-Fi密码" onChange={value => this.handleChange(value, 'hostWifiPsw')} />
                                        <ErrorTip style={{color:'#fb8632'}}>{hostWifiPswTip}</ErrorTip>
                                    </FormItem>
                                </td>
                            </tr>
                        </div>
                    </Form>
                    <div className="border"></div>
                    <Form>
                        <div className='content'>
                            <CustomIcon style={{position: 'absolute', left: '-28px'}} size={20} type="customer"></CustomIcon>
                            <tr style={{marginBottom: 20}}>
                                <th colSpan={2}>顾客Wi-Fi
                                    <span>（推荐开放给顾客使用）</span>
                                    <Switch style={{position: 'absolute', right: 0}} checked={guestWifi} onChange={this.openGuestSetting} defaultChecked />
                                </th>
                            </tr>
                            <tr>
                                <td><label>Wi-Fi名称</label></td>
                                <td>
                                    <FormItem>
                                        <Input value={guestWifiName} maxLength={32}  disabled={!guestWifi} type="text" placeholder="请输入Wi-Fi名称" onChange={value => this.handleChange(value, 'guestWifiName')} />
                                        <ErrorTip style={{color:'#fb8632'}}>{guestWifiNameTip}</ErrorTip>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Wi-Fi密码</label></td>
                                <td>
                                    <FormItem>
                                        <Input value={guestWifiPsw} maxLength={32} disabled={!guestWifi} type="password" placeholder="请输入Wi-Fi密码" onChange={value => this.handleChange(value, 'guestWifiPsw')} />
                                        <ErrorTip style={{color:'#fb8632'}}>{guestWifiPswTip}</ErrorTip>
                                    </FormItem>
                                </td>
                            </tr>
                        </div>
                    </Form>
                </div>
                <div style={{ margin : "auto", textAlign : 'center', width : 260 }}>
                    <Button size='large' type="primary"  loading={this.state.loading} onClick={this.submit} disabled={!canSubmit} style={{width : "100%"}} >完成</Button>
                    <div className="help">
                        <a href="javascript:;" onClick={this.back} className="ui-tips">上一步</a>
                    </div>
                </div>
                <Modal
                    visible={true}
                    maskStyle={{ visibility: this.state.visibile }}
                    closable={false}
                    wrapClassName={'hidden' === this.state.visibile && 'ui-hidden'}
                    centered={true}
                    style={{ textAlign: 'center', visibility: this.state.visibile }}
                    footer={null}
                >
                    { !this.state.done ?
                        <div className="progress">
                            <Icon type="loading" style={{ fontSize: 80, color: "#FB8632", marginBottom: 20 }} spin />
                            <Tips size="16" top={5}>正在等待Wi-Fi重启，请稍候...</Tips>
                        </div>
                        :
                        <div className="success">
                            <div style={{ marginBottom: 20 }}><CustomIcon size={80} color="#87d068" type="correct"></CustomIcon></div>
                            <div className="ui-t2">设置完成，请重新连接你的无线网络</div>
                            <div className="ui-t3">商户Wi-Fi：{this.state.hostWifiName}</div>
                            {
                                this.state.guestWifi ? <div className="ui-t3">顾客Wi-Fi：{this.state.guestWifiName}</div> : ''
                            }
                            <img className='ui-center' src={require('~/assets/images/qr.png')} style={{
                                height: 100,
                                width: 100,
                                border: "1px solid #ccc",
                                margin: "10px auto 5px",
                            }} />
                            <div className="ui-tips">扫描二维码下载APP</div>
                        </div>
                    }
                </Modal>
            </div> 
        );
    }
};



