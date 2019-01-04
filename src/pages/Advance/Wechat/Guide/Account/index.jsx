
import React from 'react';
import { Button, Modal, Timeline, Icon } from 'antd';
import Form from '~/components/Form';
import { checkStr } from '~/assets/common/check';

import './account.scss';

const { FormItem, Input, ErrorTip } = Form;

export default class Account extends React.Component {
    constructor(props) {
        super(props);
    }
 
    state = {
        ssid: '',
        ssidTip: '',
        shopId: '',
        shopIdTip: '',
        appId: '',
        appIdTip: '',
        secretKey: '',
        secretKeyTip: '',
        loading: false,
        visible: false,
    }

    onChange = (name, value) => {
        const check = {
            ssid:{
                func: checkStr,
                args: { who: 'SSID', min: 1, max: 32, type: 'english'},
            },
            shopId:{
                func: checkStr,
                args: { who: 'ShopID', min: 1, max: 32, type: 'english'},
            },
            appId:{
                func: checkStr,
                args: { who: 'AppID', min: 1, max: 32, type: 'english'},
            },
            secretKey:{
                func: checkStr,
                args: { who: 'SecretKey', min: 1, max: 32, type: 'english'},
            },
        };

        let tip;
        if ('' === value) {
            tip = `请复制粘贴${check[name].args['who']}`;
        } else {
            tip = check[name].func(value, check[name].args);
        }

        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        });
    }

    settingGuide = () => {
        this.setState({
            visible: true
        });
    }

    modalClose = () => {
        this.setState({
            visible: false
        });
    }

    preStep = () => {
        const { ssid, shopId, appId, secretKey } = this.state;
        let data = { ssid, shopId, appId, secretKey };

        window.sessionStorage.setItem('wechat.account', JSON.stringify(data));

        this.props.history.push('/advance/wechat/setup/welcome');
    }

    nextStep = () => {
        const params = this.props.match.params;
        const { ssid, shopId, appId, secretKey } = this.state;

        let data = { ssid, shopId, appId, secretKey };
        let param = Object.assign({}, data, JSON.parse(decodeURIComponent(params.param)));

        let path = this.props.match.path;
        // let parent = path.substr(0, path.lastIndexOf('/'));

        window.sessionStorage.setItem('wechat.account', JSON.stringify(data));

        // this.props.history.push(`${parent}/wifi/` + encodeURIComponent(JSON.stringify(param)));
        this.props.history.push(`/advance/wechat/setup/wifi/` + encodeURIComponent(JSON.stringify(param)));
    }

    async fetchConf() {
        let response = await common.fetchApi({ opcode: 'AUTH_WEIXIN_CONFIG_GET' });
        let { errcode, data } = response;

        if (0 === errcode) {
            const { ssid, shopid, appid, secretkey } = data[0].result.weixin;
            this.setState({
                ssid: ssid,
                shopId: shopid,
                appId: appid,
                secretKey: secretkey,
            });
        }
    }

    componentDidMount() {
        const val = window.sessionStorage.getItem('wechat.account');

        if (val) {  //sessionStorage.getItem('wechat.account') 存在时
            const { ssid, shopId, appId, secretKey } = JSON.parse(val);
            this.setState({
                ssid: ssid,
                shopId: shopId,
                appId: appId,
                secretKey: secretKey,
            });
            return;
        }

        this.fetchConf();
    }

    render() {
        const { ssid, ssidTip, shopId, shopIdTip, appId, appIdTip, secretKey, secretKeyTip, loading, visible } = this.state;
        const nextStepCheck = ['ssid', 'shopId', 'appId', 'secretKey' ].some(item => {
            return this.state[item] === '' || this.state[item + 'Tip'] !== '';
        });
        const disabled = nextStepCheck;

        return (
            <React.Fragment>
                <div className='setup-content'>
                    <p className='help'>
                        这里需要填写您的微信公众号信息，顾客在连上客用Wi-Fi之后即可一键关注您的公众号。
                        如不清楚如何获取下方信息，请按（<a href='javascript:;' onClick={this.settingGuide}>微信公众平台设置指引</a>）操作
                    </p>
                    <GuideModal visible={visible} close={this.modalClose}/>
                    <Form style={{ margin: 0, padding: 0 }}>
                        <label>SSID</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={ssidTip}>
                                <Input type="text" maxLength={32}  placeholder={'请复制粘贴SSID'} value={ssid} onChange={(value)=>this.onChange('ssid', value)} />
                                <ErrorTip >{ssidTip}</ErrorTip>
                            </FormItem>
                        </div>

                        <label>ShopID</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={shopIdTip}>
                                <Input type="text" maxLength={32} placeholder={'请复制粘贴ShopID'} value={shopId} onChange={(value)=>this.onChange('shopId', value)} />
                                <ErrorTip >{shopIdTip}</ErrorTip>
                            </FormItem>
                        </div>

                        <label>AppID</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={appIdTip}>
                                <Input type="text" maxLength={32} placeholder={'请复制粘贴AppID'} value={appId} onChange={(value)=>this.onChange('appId', value)} />
                                <ErrorTip >{appIdTip}</ErrorTip>
                            </FormItem>
                        </div>

                        <label>SecretKey</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={secretKeyTip} style={{marginBottom: 0}}>
                                <Input type="text" maxLength={32} placeholder={'请复制粘贴SecretKey'} value={secretKey} onChange={(value)=>this.onChange('secretKey', value)} />
                                <ErrorTip >{secretKeyTip}</ErrorTip>
                            </FormItem>
                        </div>
                    </Form>
                </div>
                <section className="save-area">
                    <Button
                        type="primary"
                        size="large"
                        onClick={this.preStep}
                    >上一步</Button>
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        disabled={disabled}
                        onClick={this.nextStep}
                    >下一步</Button>
                </section>
            </React.Fragment>
        );
    }
}

const GuideModal = (props) => {
    const itemColor = '#FF8E2D';
    return (
        <Modal
            visible={props.visible}
            className='account-step-guide'
            width={824}
            centered
            closable={false}
            footer={null}
        >
            <div className='body'>
                <h4>微信公众平台设置指引</h4>
                <div className='content'>
                    <Timeline>
                        <Timeline.Item color={itemColor}>
                            <label>添加功能插件</label>
                            <p>用已有公众号（必须是服务号）或新注册账号<a href='https://mp.weixin.qq.com' target='_blank'>登录公众平台</a>，添加“<b>门店小程序</b>”和“<b>微信连Wi-Fi</b>”功能插件。</p>
                            <img style={{width: 680, height: 150}} src={require('~/assets/images/add-feature.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>添加门店</label>
                            <p>进入“<b>门店小程序</b>”插件，点击添加门店，按照指引添加完成。</p>
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>添加Wi-Fi设备</label>
                            <p style={{marginBottom: 0}}>进入“<b>微信连Wi-Fi</b>”插件，在设备管理标签页点击添加设备。设备所需门店选择上一步添加的门店；设备类型选择Portal型设备；网络名（SSID）输入客用Wi-Fi的名称（当前客用Wi-Fi名称：<b>SUNMI_XX_Guest）</b>。</p>
                            <p style={{marginTop: 0, color: '#ADB1B9'}}>注：网络名（SSID）需与客用Wi-Fi名称保持一致，以保证微信连Wi-Fi功能正常，如填写不一致，在设置完成后将自动覆盖客用Wi-Fi名称。</p>
                            <img style={{width: 680, height: 220}} src={require('~/assets/images/add-wifi.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>复制所需信息</label>
                            <p>进入“<b>微信连Wi-Fi</b>”插件，在设备管理标签页，点击设备详情，即可找到所需的信息，将其复制粘贴到对应的输入框。</p>
                            <img style={{width: 680, height: 220}} src={require('~/assets/images/copy-info.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>完成</label>
                        </Timeline.Item>
                    </Timeline>
                </div>
            </div>
            <div className='footer'>
                <Button type='primary' onClick={props.close}>我知道了</Button>
            </div>
        </Modal>
    );
}