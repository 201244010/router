
import React from 'react';
import { Button, Switch, Modal, Icon, message } from 'antd';
import { Base64 } from 'js-base64';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import Tips from '~/components/Tips';
import {checkStr} from '~/assets/common/check';

const MODULE = 'setwifi';
const { FormItem, Input, ErrorTip } = Form;
const confirm = Modal.confirm;
const errorMessage = {
    // '-1001': '参数格式错误',
    // '-1002': '参数非法',
    // '-1100': 'Wi-Fi名称非法',
    // '-1101': 'Wi-Fi密码非法',
    '-1001': intl.get(MODULE, 0),
    '-1002': intl.get(MODULE, 1),
    '-1100': intl.get(MODULE, 2),
    '-1101': intl.get(MODULE, 3),
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
    };

    back = ()=>{
        this.props.history.push("/guide/setwan");
    };

    handleChange = (value, field) => {
        const type = {
            hostWifiName: {
                tip: checkStr(value, { who: intl.get(MODULE, 4), min: 1, max: 32, type: 'all', byte: true })
            }, 
            hostWifiPsw: {
                tip: checkStr(value, { who: intl.get(MODULE, 5), min: 8, max: 32, type: 'english', byte: true })
            }, 
            guestWifiName: {
                tip: checkStr(value, { who: intl.get(MODULE, 6), min: 1, max: 32, type: 'all', byte: true })
            }, 
            guestWifiPsw: {
                tip: checkStr(value, { who: intl.get(MODULE, 7), min: 8, max: 32, type: 'english', byte: true })
            }
        }

        let tip = type[field].tip;

        if(value.length === 0 && (field === 'hostWifiPsw' || field === 'guestWifiPsw')){
            tip = '';
        }

        if('' === value.trim() && 8 <= value.length && (field === 'hostWifiPsw' || field === 'guestWifiPsw')){
            // tip = '密码不能全为空格';
            tip = intl.get(MODULE, 8);
        }

        this.setState({
            [field] : value,
            [field+'Tip']: tip,
        });
    }

    dataSet = async() =>{
        const { hostWifiName, guestWifiName, hostWifiPsw, guestWifiPsw } = this.state;
        let data = { hostWifiName, guestWifiName, hostWifiPsw, guestWifiPsw };
        let param = JSON.stringify(data);

        this.mainWireLess.host.band_2g.ssid = hostWifiName;
        this.mainWireLess.host.band_2g.password = Base64.encode(hostWifiPsw);
        this.mainWireLess.host.band_5g.ssid = hostWifiName.substring(0,29) + '_5G';
        this.mainWireLess.host.band_5g.password = Base64.encode(hostWifiPsw);
        this.guestWireLess.ssid = guestWifiName;
        this.guestWireLess.static_password = Base64.encode(guestWifiPsw);
        this.guestWireLess.enable = '1';
        this.mainWireLess.host.band_2g.encryption = hostWifiPsw.length === 0 ?'none':'psk-mixed/ccmp+tkip';
        this.mainWireLess.host.band_5g.encryption = hostWifiPsw.length === 0 ?'none':'psk-mixed/ccmp+tkip';
        this.guestWireLess.encryption = guestWifiPsw.length === 0 ? 'none':'psk-mixed/ccmp+tkip';
        this.mainWireLess.host.band_2g.enable = "1";

        let response = await common.fetchApi(
            [{
                opcode: 'WIRELESS_SET',
                data: { main : this.mainWireLess, guest : this.guestWireLess}
            }]
        );
        this.setState({ loading : false});
        
        let {errcode} = response;
        if(errcode === 0){
            this.props.history.push(`/guide/finish/applying/` + encodeURIComponent(param));
        } else {
            // message.error(`Wi-Fi设置失败[${errorMessage[errcode] || errcode}]`);
            message.error(intl.get(MODULE, 9, {errcode: errorMessage[errcode] || errcode}));
        }
        
    }

    submit = async ()=> {
        this.setState({ loading : true });
        if(this.state.hostWifiPsw.length === 0 || this.state.guestWifiPsw.length === 0){
            confirm({
                title: intl.get(MODULE, 10),
                content: (this.state.hostWifiPsw.length === 0 ?intl.get(MODULE, 11) : '') + 
                (this.state.hostWifiPsw.length === 0 && this.state.guestWifiPsw.length === 0 ? intl.get(MODULE, 12) : '')+
                (this.state.guestWifiPsw.length === 0 ? intl.get(MODULE, 13) : '') +intl.get(MODULE, 14),
                onOk: this.dataSet,
                onCancel(){   

                },
                cancelText: intl.get(MODULE, 15),
                okText: intl.get(MODULE, 16),
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
        message.error(intl.get(MODULE, 17, {errcode}));
    }

    componentDidMount(){
        this.fetchWireLessInfo();
    }

    componentWillUnmount(){
        this.stop = true;
    }

    render(){
        let { hostWifiName, hostWifiPsw, guestWifiName, guestWifiPsw, hostWifiNameTip, hostWifiPswTip, guestWifiNameTip, guestWifiPswTip } = this.state;

        const checkName = ['hostWifiName', 'guestWifiName'].some(item => {          //判定Wi-Fi名称的合法性
           return 0 === this.state[item].length || '' !== this.state[item + 'Tip'];
        });

        const checkPwd = ['hostWifiPswTip', 'guestWifiPswTip'].some(item => {       //判定Wi-Fi密码的合法性
            return '' !== this.state[item];
        });

        let disabled = checkName || checkPwd;

        if(hostWifiName.length > 0 && guestWifiName.length > 0 && hostWifiName === guestWifiName){
            hostWifiNameTip = guestWifiNameTip = intl.get(MODULE, 18);
            disabled = true;
        }

        return (
            <div className="setwifi">
                <h2>{intl.get(MODULE, 19)}</h2> 
                <p className="ui-tips guide-tip">{intl.get(MODULE, 20)}</p>
                <div className="wifi-box ui-relative ui-center">
                    <Form>
                        <div style={{marginBottom: 20}}>
                            <CustomIcon style={{position: 'absolute', left: '-28px'}} size={20} color='#FB8632' type="business"></CustomIcon>
                                <p style={{fontSize: 16}}>{intl.get(MODULE, 21)}<span style={{fontSize: 14, color: '#ADB1B9'}}>{intl.get(MODULE, 22)}</span></p>
                        </div>
                        <FormItem label={intl.get(MODULE, 23)} showErrorTip={hostWifiNameTip}>
                            <Input value={hostWifiName} width={260} maxLength={32} type="text" placeholder={intl.get(MODULE, 24)} onChange={value => this.handleChange(value, 'hostWifiName')} />
                            <ErrorTip>{hostWifiNameTip}</ErrorTip>
                        </FormItem>
                        <FormItem label={intl.get(MODULE, 25)} showErrorTip={hostWifiPswTip}>
                            <Input value={hostWifiPsw} width={260} maxLength={32} type="password" placeholder={intl.get(MODULE, 26)} onChange={value => this.handleChange(value, 'hostWifiPsw')} />
                            <ErrorTip>{hostWifiPswTip}</ErrorTip>
                        </FormItem>
                    </Form>
                    <div className="border"></div>
                    <Form>
                        <div style={{marginBottom: 20}}>
                            <CustomIcon style={{position: 'absolute', left: '-28px'}} size={20} color='#4EC53F' type="customer"></CustomIcon>
                                <span style={{fontSize: 16}}>{intl.get(MODULE, 27)}<span style={{fontSize: 14, color: '#ADB1B9'}}>{intl.get(MODULE, 28)}</span>
                                </span>
                                {/* <Switch style={{position: 'absolute', right: 0}} checked={guestWifi} onChange={this.openGuestSetting} defaultChecked /> */}
                        </div>
                        <FormItem label={intl.get(MODULE, 23)} showErrorTip={guestWifiNameTip}>
                            <Input value={guestWifiName} width={260} maxLength={32} type="text" placeholder={intl.get(MODULE, 24)} onChange={value => this.handleChange(value, 'guestWifiName')} />
                            <ErrorTip>{guestWifiNameTip}</ErrorTip>
                        </FormItem>
                        <FormItem label={intl.get(MODULE, 25)} showErrorTip={guestWifiPswTip}>
                            <Input value={guestWifiPsw} width={260} maxLength={32} type="password" placeholder={intl.get(MODULE, 26)} onChange={value => this.handleChange(value, 'guestWifiPsw')} />
                            <ErrorTip>{guestWifiPswTip}</ErrorTip>
                        </FormItem>
                    </Form>
                </div>
                <div style={{ margin : "auto", textAlign : 'center', width : 260 }}>
                    <Button size='large' type="primary"  loading={this.state.loading} onClick={this.submit} disabled={disabled} style={{width : "100%"}} >{intl.get(MODULE, 30)}</Button>
                    <div className="help">
                        <a href="javascript:;" onClick={this.back} className="ui-tips">{intl.get(MODULE, 31)}</a>
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



