
import React from 'react';
import { Button, Modal, Timeline, Icon } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import { checkStr } from '~/assets/common/check';

import './account.scss';

const MODULE = 'wechatAccount';
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
                args: { who: 'SSID', min: 1, max: 32, byte: true },
            },
            shopId:{
                func: checkStr,
                args: { who: 'ShopID', min: 1, max: 32 },
            },
            appId:{
                func: checkStr,
                args: { who: 'AppID', min: 1, max: 32 },
            },
            secretKey:{
                func: checkStr,
                args: { who: 'SecretKey', min: 1, max: 32 },
            },
        };

        let tip;
        if ('' === value) {
            tip = `${intl.get(MODULE, 37)/*_i18n:请复制粘贴*/}${check[name].args['who']}`;
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

    // preStep = () => {
    //     const { ssid, shopId, appId, secretKey } = this.state;
    //     let data = { ssid, shopId, appId, secretKey };

    //     window.sessionStorage.setItem('wechat.account', JSON.stringify(data));

    //     this.props.history.push('/routersetting/wechat/setup/welcome');
    // }

    nextStep = () => {
        // const params = this.props.match.params;
        const { ssid, shopId, appId, secretKey } = this.state;

        let data = { ssid, shopId, appId, secretKey };
        // let param = Object.assign({}, data, JSON.parse(decodeURIComponent(params.param)));
        let param = Object.assign({}, data);

        window.sessionStorage.setItem('wechat.account', JSON.stringify(data));

        this.props.history.push(`/routersetting/wechat/setup/wifi/` + encodeURIComponent(JSON.stringify(param)));
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
                    <PanelHeader title={intl.get(MODULE, 0)/*_i18n:填写公众号信息*/} checkable={false}/>
                    <p className='help'>
                    {intl.get(MODULE, 1)/*_i18n:为给您的微信公众号引流吸粉，请登陆微信公众平台开通“微信连Wi-Fi”功能*/}<a href='javascript:;' onClick={this.settingGuide}>{intl.get(MODULE, 2)/*_i18n:（微信公众平台设置指引）*/}</a>{intl.get(MODULE, 3)/*_i18n:，获得下方所需的信息，将其复制到此页面对应的输入框中。*/}</p>
                    <GuideModal visible={visible} close={this.modalClose}/>
                    <Form className='setup-form'>
                        <label>{intl.get(MODULE, 4)/*_i18n:SSID*/}</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={ssidTip}>
                                <Input type="text" maxLength={32}  placeholder={intl.get(MODULE, 5)/*_i18n:请复制粘贴SSID*/} value={ssid} onChange={(value)=>this.onChange('ssid', value)} />
                                <ErrorTip >{ssidTip}</ErrorTip>
                            </FormItem>
                        </div>

                        <label>{intl.get(MODULE, 9)/*_i18n:ShopID*/}</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={shopIdTip}>
                                <Input type="text" maxLength={32} placeholder={intl.get(MODULE, 6)/*_i18n:请复制粘贴ShopID*/} value={shopId} onChange={(value)=>this.onChange('shopId', value)} />
                                <ErrorTip >{shopIdTip}</ErrorTip>
                            </FormItem>
                        </div>

                        <label>{intl.get(MODULE, 10)/*_i18n:AppID*/}</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={appIdTip}>
                                <Input type="text" maxLength={32} placeholder={intl.get(MODULE, 7)/*_i18n:请复制粘贴AppID*/} value={appId} onChange={(value)=>this.onChange('appId', value)} />
                                <ErrorTip >{appIdTip}</ErrorTip>
                            </FormItem>
                        </div>

                        <label>{intl.get(MODULE, 11)/*_i18n:SecretKey*/}</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={secretKeyTip} style={{marginBottom: 0}}>
                                <Input type="text" maxLength={32} placeholder={intl.get(MODULE, 8)/*_i18n:请复制粘贴SecretKey*/} value={secretKey} onChange={(value)=>this.onChange('secretKey', value)} />
                                <ErrorTip >{secretKeyTip}</ErrorTip>
                            </FormItem>
                        </div>
                    </Form>
                </div>
                <section className="save-area">
                    {/* <Button
                        type="primary"
                        size="large"
                        onClick={this.preStep}
                    >上一步</Button> */}
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        disabled={disabled}
                        onClick={this.nextStep}
                    >{intl.get(MODULE, 12)/*_i18n:下一步*/}</Button>
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
                <h4>{intl.get(MODULE, 13)/*_i18n:微信公众平台设置指引*/}</h4>
                <div className='content'>
                    <Timeline>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 14)/*_i18n:添加功能插件*/}</label>
                            <p>{intl.get(MODULE, 15)/*_i18n:用已有公众号（必须是服务号）或新注册账号*/}<a href='https://mp.weixin.qq.com' target='_blank'>{intl.get(MODULE, 16)/*_i18n:登录公众平台*/}</a>{intl.get(MODULE, 17)/*_i18n:，添加“*/}<b>{intl.get(MODULE, 18)/*_i18n:门店小程序*/}</b>{intl.get(MODULE, 19)/*_i18n:”和“*/}<b>{intl.get(MODULE, 20)/*_i18n:微信连Wi-Fi*/}</b>{intl.get(MODULE, 21)/*_i18n:”功能插件。*/}</p>
                            <img className='img-first' src={require('~/assets/images/add-feature.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 22)/*_i18n:添加门店*/}</label>
                            <p>{intl.get(MODULE, 23)/*_i18n:进入“*/}<b>{intl.get(MODULE, 24)/*_i18n:门店小程序*/}</b>{intl.get(MODULE, 25)/*_i18n:”插件，点击添加门店，按照指引添加完成。*/}</p>
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 26)/*_i18n:添加Wi-Fi设备*/}</label>
                            <p>{intl.get(MODULE, 27)/*_i18n:进入“*/}<b>{intl.get(MODULE, 28)/*_i18n:微信连Wi-Fi*/}</b>{intl.get(MODULE, 29)/*_i18n:”插件，在设备管理标签页点击添加设备。设备所需门店选择上一步添加的门店；设备类型选择Portal型设备；网络名（SSID）输入客用Wi-Fi的名称（当前客用Wi-Fi名称：*/}<b>SUNMI_XX_Guest</b>）。</p>
                            <p className='content-p'>{intl.get(MODULE, 30)/*_i18n:注：网络名（SSID）需与客用Wi-Fi名称保持一致，以保证微信连Wi-Fi功能正常，如填写不一致，在设置完成后将自动覆盖客用Wi-Fi名称。*/}</p>
                            <img className='img-second' src={require('~/assets/images/add-wifi.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 31)/*_i18n:复制所需信息*/}</label>
                            <p>{intl.get(MODULE, 32)/*_i18n:进入“*/}<b>{intl.get(MODULE, 33)/*_i18n:微信连Wi-Fi*/}</b>{intl.get(MODULE, 34)/*_i18n:”插件，在设备管理标签页，点击设备详情，即可找到所需的信息，将其复制粘贴到对应的输入框。*/}</p>
                            <img className='img-third' src={require('~/assets/images/copy-info.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 35)/*_i18n:完成*/}</label>
                        </Timeline.Item>
                    </Timeline>
                </div>
            </div>
            <div className='footer'>
                <Button type='primary' onClick={props.close}>{intl.get(MODULE, 36)/*_i18n:我知道了*/}</Button>
            </div>
        </Modal>
    );
}