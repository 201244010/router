import React from 'react';
import { Button, Switch, Modal, Icon, message } from 'antd';
import { Base64 } from 'js-base64';
import Form from '~/components/Form';
import { encryption } from '~/assets/common/encryption';
import {checkStr} from '~/assets/common/check';

const MODULE = 'setwifi';
const { FormItem, Input, ErrorTip } = Form;
const confirm = Modal.confirm;
const errorMessage = {
    // '-1001': '参数格式错误',
    // '-1002': '参数非法',
    // '-1100': 'Wi-Fi名称非法',
    // '-1101': 'Wi-Fi密码非法',
    '-1001': intl.get(MODULE, 0)/*_i18n:参数格式错误*/,
    '-1002': intl.get(MODULE, 1)/*_i18n:参数非法*/,
    '-1100': intl.get(MODULE, 2)/*_i18n:Wi-Fi名称非法*/,
    '-1101': intl.get(MODULE, 3)/*_i18n:Wi-Fi密码非法*/,
};

export default class SetWifi extends React.Component {
    constructor(props){
        super(props); 
        this.tick = 1;   
    }

    state = {
        loading : false,
        hostWifiName : '',
        hostWifiPsw : '',
        guestWifiName : '',
        guestWifiPsw : '',
        hostWifiNameTip: '',
        hostWifiPswTip: '',
        guestWifiNameTip: '',
        guestWifiPswTip: '',
        setTip: false,
    };

    setCustomerWifi = () => {
        let {setTip} = this.state;
        setTip = !setTip;
        this.setState({setTip: setTip});
    }

    back = ()=>{
        this.props.history.push("/guide/setwan");
    };

    handleChange = (value, field) => {
        const type = {
            hostWifiName: {
                tip: checkStr(value, { who: intl.get(MODULE, 4)/*_i18n:Wi-Fi名称*/, min: 1, max: 32, type: 'all', byte: true })
            }, 
            hostWifiPsw: {
                tip: checkStr(value, { who: intl.get(MODULE, 5)/*_i18n:Wi-Fi密码*/, min: 8, max: 32, type: 'english', byte: true })
            }, 
            guestWifiName: {
                tip: checkStr(value, { who: intl.get(MODULE, 6)/*_i18n:Wi-Fi名称*/, min: 1, max: 32, type: 'all', byte: true })
            }, 
            guestWifiPsw: {
                tip: checkStr(value, { who: intl.get(MODULE, 7)/*_i18n:Wi-Fi密码*/, min: 8, max: 32, type: 'english', byte: true })
            }
        }

        let tip = type[field].tip;

        if(value.length === 0 && (field === 'hostWifiPsw' || field === 'guestWifiPsw')){
            tip = '';
        }

        if('' === value.trim() && 8 <= value.length && (field === 'hostWifiPsw' || field === 'guestWifiPsw')){
            // tip = '密码不能全为空格';
            tip = intl.get(MODULE, 8)/*_i18n:密码不能全为空格*/;
        }

        this.setState({
            [field] : value,
            [field+'Tip']: tip,
        });
    }

    dataSet = async() =>{
        let { hostWifiName, guestWifiName, hostWifiPsw, guestWifiPsw, setTip } = this.state;
        if (setTip) {
            this.guestWireLess.ssid = guestWifiName;
            this.guestWireLess.static_password = encryption(guestWifiPsw);
            this.guestWireLess.enable = '1';
            this.guestWireLess.encryption = guestWifiPsw.length === 0 ? 'none':'psk-mixed/ccmp+tkip';
        }
        
        this.mainWireLess.host.band_2g.ssid = hostWifiName;
        this.mainWireLess.host.band_2g.password = encryption(hostWifiPsw);
        this.mainWireLess.host.band_5g.ssid = hostWifiName.substring(0,29) + '_5G';
        this.mainWireLess.host.band_5g.password = encryption(hostWifiPsw);
        this.mainWireLess.host.band_2g.encryption = hostWifiPsw.length === 0 ?'none':'psk-mixed/ccmp+tkip';
        this.mainWireLess.host.band_5g.encryption = hostWifiPsw.length === 0 ?'none':'psk-mixed/ccmp+tkip';
        this.mainWireLess.host.band_2g.enable = "1";

        let data = { hostWifiName, guestWifiName, hostWifiPsw, guestWifiPsw, setTip };
        let param = JSON.stringify(data);

        let response = await common.fetchApi(
            [{
                opcode: 'WIRELESS_SET',
                data: { main : this.mainWireLess, guest : this.guestWireLess}
            }]
        );
        this.setState({ loading : false});
        
        let {errcode} = response;
        if(errcode === 0){
            this.props.history.push(`/guide/setwifi/applying/` + encodeURIComponent(param));
        } else {
            // message.error(`Wi-Fi设置失败[${errorMessage[errcode] || errcode}]`);
            message.error(intl.get(MODULE, 9, {error: errorMessage[errcode] || errcode})/*_i18n:Wi-Fi设置失败[{error}]*/);
        }
        
    }

    submit = async ()=> {
        const {hostWifiPsw, guestWifiPsw, setTip} = this.state;
        this.setState({ loading : true });
        if(hostWifiPsw.length === 0 || (setTip && guestWifiPsw.length === 0)){
            confirm({
                title: intl.get(MODULE, 10)/*_i18n:提示：*/,
                content: (hostWifiPsw.length === 0 ?intl.get(MODULE, 11)/*_i18n:商户Wi-Fi*/ : '') + 
                (hostWifiPsw.length === 0 && guestWifiPsw.length === 0 && setTip? intl.get(MODULE, 12)/*_i18n:、*/ : '')+
                (guestWifiPsw.length === 0 && setTip? intl.get(MODULE, 13)/*_i18n:顾客Wi-Fi*/ : '') +intl.get(MODULE, 14)/*_i18n:密码未设置，确定继续?*/,
                onOk: this.dataSet,
                onCancel(){   

                },
                cancelText: intl.get(MODULE, 15)/*_i18n:取消*/,
                okText: intl.get(MODULE, 16)/*_i18n:确定*/,
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
                guestWifiPsw : Base64.decode(guest.static_password)   
            });
            return;
        }
        // message.error(`Wi-Fi信息获取失败[${errcode}]`);
        message.error(intl.get(MODULE, 17, {error: errcode})/*_i18n:Wi-Fi信息获取失败[{error}]*/);
    }

    componentDidMount(){
        this.fetchWireLessInfo();
    }

    componentWillUnmount(){
        this.stop = true;
    }

    render(){
        let { hostWifiName, hostWifiPsw, guestWifiName, guestWifiPsw, hostWifiNameTip, hostWifiPswTip, guestWifiNameTip, guestWifiPswTip, setTip } = this.state;
        let display = '';
        let setTipShow = '';
        let disabled;
        if (setTip) {
            display = 'inline-block';
            setTipShow = intl.get(MODULE, 32)/*_i18n:暂不设置客户Wi-Fi*/;

            const checkName = ['hostWifiName', 'guestWifiName'].some(item => {          //判定Wi-Fi名称的合法性
                return 0 === this.state[item].length || '' !== this.state[item + 'Tip'];
             });
     
            const checkPwd = ['hostWifiPswTip', 'guestWifiPswTip'].some(item => {       //判定Wi-Fi密码的合法性
                return '' !== this.state[item];
            });
    
            disabled = checkName || checkPwd;
    
            if(hostWifiName.length > 0 && guestWifiName.length > 0 && hostWifiName === guestWifiName){
                hostWifiNameTip = guestWifiNameTip = intl.get(MODULE, 18)/*_i18n:商户Wi-Fi名称与客用Wi-Fi名称不能相同*/;
                disabled = true;
            }
        } else {
            display = 'none';
            setTipShow = intl.get(MODULE, 33)/*_i18n:设置客用Wi-Fi*/;

            const checkName = ['hostWifiName'].some(item => {          //判定Wi-Fi名称的合法性
                return 0 === this.state[item].length || '' !== this.state[item + 'Tip'];
             });
     
            const checkPwd = ['hostWifiPswTip'].some(item => {       //判定Wi-Fi密码的合法性
                return '' !== this.state[item];
            });
    
            disabled = checkName || checkPwd;
        }
        
        

        return (
            <div className="setwifi">
                <h2>{intl.get(MODULE, 19)/*_i18n:设置无线网络*/}</h2> 
                <p className="ui-tips guide-tip">{intl.get(MODULE, 20)/*_i18n:客用Wi-Fi可开放给客人使用，保障隐私安全*/}</p>
                <div className="wifi-box ui-relative">
                    <Form style={{display: 'inline-block',marginRight: 420}}>
                        <div style={{marginBottom: 20,textAlign: 'left'}}>
                                <p  className='title'>{intl.get(MODULE, 21)/*_i18n:商户Wi-Fi*/}<span className='titleTip'>{intl.get(MODULE, 22)/*_i18n:（建议店内设备和店员使用）*/}</span></p>
                        </div>
                        <FormItem
                            label={intl.get(MODULE, 23)/*_i18n:Wi-Fi名称*/}
                            labelStyle={{width: 'auto', verticalAlign: 'top'}}
                            inputStyle={{marginLeft: 12, width: 260}}
                            showErrorTip={hostWifiNameTip}>
                            <Input value={hostWifiName} maxLength={32} type="text" placeholder={intl.get(MODULE, 24)/*_i18n:请输入Wi-Fi名称*/} onChange={value => this.handleChange(value, 'hostWifiName')} />
                            <ErrorTip style={{width: 260}}>{hostWifiNameTip}</ErrorTip>
                        </FormItem>
                        <FormItem
                            label={intl.get(MODULE, 25)/*_i18n:Wi-Fi密码*/}
                            labelStyle={{width: 'auto',verticalAlign: 'top'}}
                            inputStyle={{marginLeft: 12, width: 260}}
                            showErrorTip={hostWifiPswTip}>
                            <Input value={hostWifiPsw} maxLength={32} type="password" placeholder={intl.get(MODULE, 26)/*_i18n:请输入Wi-Fi密码*/} onChange={value => this.handleChange(value, 'hostWifiPsw')} />
                            <ErrorTip style={{width: 260}}>{hostWifiPswTip}</ErrorTip>
                        </FormItem>
                    </Form>
                    <Form style={{display: display,marginRight: 420,marginBottom: 0}}>
                        <div style={{marginBottom: 20,textAlign: 'left'}}>
                                <span className='title'>{intl.get(MODULE, 27)/*_i18n:客用Wi-Fi*/}<span className='titleTip'>{intl.get(MODULE, 28)/*_i18n:（推荐开放给顾客使用）*/}</span>
                                </span>
                        </div>
                        <FormItem
                            label={intl.get(MODULE, 23)/*_i18n:Wi-Fi名称*/}
                            labelStyle={{width: 'auto',verticalAlign: 'top'}}
                            inputStyle={{marginLeft: 12, width: 260}}
                            showErrorTip={guestWifiNameTip}>
                            <Input value={guestWifiName} width={260} maxLength={32} type="text" placeholder={intl.get(MODULE, 24)/*_i18n:请输入Wi-Fi名称*/} onChange={value => this.handleChange(value, 'guestWifiName')} />
                            <ErrorTip style={{width: 260}}>{guestWifiNameTip}</ErrorTip>
                        </FormItem>
                        <FormItem
                            label={intl.get(MODULE, 25)/*_i18n:Wi-Fi密码*/}
                            labelStyle={{width: 'auto',verticalAlign: 'top'}}
                            inputStyle={{marginLeft: 12, width: 260}}
                            showErrorTip={guestWifiPswTip}>
                            <Input value={guestWifiPsw} width={260} maxLength={32} type="password" placeholder={intl.get(MODULE, 26)/*_i18n:请输入Wi-Fi密码*/} onChange={value => this.handleChange(value, 'guestWifiPsw')} />
                            <ErrorTip style={{width: 260}}>{guestWifiPswTip}</ErrorTip>
                        </FormItem>
                    </Form>
                </div>
                <div className='footer'>
                    <p className='setTip' onClick={this.setCustomerWifi}>{setTipShow}</p>
                    <Button size='large' type="primary"  loading={this.state.loading} onClick={this.submit} disabled={disabled} style={{width : "100%",marginTop: 32}} >{intl.get(MODULE, 30)/*_i18n:完成*/}</Button>
                    <div className="help">
                        <a href="javascript:;" onClick={this.back} className="ui-tips">{intl.get(MODULE, 31)/*_i18n:上一步*/}</a>
                    </div>
                </div>
                {/* <Modal
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
                            <div className="ui-t2">设置完成，请重新连接您的无线网络</div>
                            <div className="ui-t3">商户Wi-Fi：{this.state.hostWifiName}</div>
                            {
                                <div className="ui-t3">顾客Wi-Fi：{this.state.guestWifiName}</div>
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
                </Modal> */}
            </div> 
        );
    }
};



