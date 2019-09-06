import React from 'react';
import { Button, Checkbox, Popconfirm, Modal, Timeline, Table, message } from 'antd';
import Form from "~/components/Form";
import { checkStr } from '~/assets/common/check';
import PanelHeader from '~/components/PanelHeader';
import CustomIcon from '~/components/Icon';
import SubLayout from '~/components/SubLayout';

import './index.scss';

const MODULE = 'wechatConnectWifi';
const {FormItem, ErrorTip, Input} = Form;

export default class Wechat extends React.Component {
    state = {
        enable: true,
        ssidDisabled: false,
        pwdDisabled: false,
        checkBoxDisabled: false,
        ssid: '',
        ssidTip: '',
        pwd: '',
        pwdTip: '',
        encryption: false,
    }

    changeEnable = value => {
        const { encryption } = this.state;
        this.setState({
            enable: value,
            checkBoxDisabled: !value,
            ssidDisabled: !value,
            pwdDisabled: !value || encryption,
        }, () => {
            const { ssidDisabled, ssidTip, pwdDisabled, pwdTip } = this.state;
            this.setState({
                ssidTip: ssidDisabled ? '' : ssidTip,
                pwdTip: pwdDisabled ? '' : pwdTip,
            })
        });
    }

    changeEncryption = e => {
        const { enable } = this.state;
        this.setState({
            encryption: e.target.checked,
            pwdDisabled: !enable || e.target.checked,
        });
    }

    onChange = (type, value) => {
        if (type === 'ssid') {
            this.setState({ ssidTip: checkStr(value, { who: intl.get(MODULE, 0)/*_i18n:客用Wi-Fi名称*/, min: 1, max: 32, type: 'wechat', byte: true })});
        } else {
            this.setState({ pwdTip: checkStr(value, { who: intl.get(MODULE, 1)/*_i18n:客用Wi-Fi密码*/, min:8 , max: 32, type: 'english', byte: true })});
        } 
        this.setState({ [type]: value });
    }

    openModal = () => {
        this.setState({modalVisible: true});
    }

    closeModal = () => {
        this.setState({modalVisible: false});
    }

    getWechatInfo = async() => {
        let response = await common.fetchApi([{ opcode: 'WIRELESS_GET' }]);
        let { errcode, data } = response;
        if(errcode === 0){
            let { guest: { ssid = '', enable = '', static_password = '', encryption = 'psk-mixed/ccmp+tkip'} = {} } = data[0].result;
            this.setState({
                ssid: ssid,
                enable: enable === '1'? true : false,
                pwd: Base64.decode(static_password),
                encryption: encryption === 'none',
                ssidDisabled: enable === '1'? false : true,
                checkBoxDisabled: enable === '1'? false : true,
                pwdDisabled: !(enable === '1') || encryption === 'none',
            });
        }
    }

    setWechatInfo = async() => {
        const { ssid, enable, pwd, encryption } = this.state;
        await common.fetchApi(
            [{
                opcode: 'WIRELESS_SET',
                data: { 
                    guest: {
                        ssid: ssid,
                        static_password: pwd,
                        encryption: encryption,
                        PWDType: 'static',
                        enable: enable? '1': '0',
                    }
                }
            }]
        );
    }

    render() {
        const { enable, ssid, ssidTip, pwd, pwdTip, encryption, ssidDisabled, pwdDisabled, checkBoxDisabled, modalVisible } = this.state;
        return (
            <SubLayout className="settings">
                <div className="setup-body">
                    <div className='setup-content'>
                        <Form className='wechat-form'>
                            <PanelHeader
                                title={intl.get(MODULE, 2)/*_i18n:微信Wi-Fi设置*/}
                                checkable={true}
                                disabled={false}
                                checked={enable}
                                onChange={this.changeEnable}
                            />
                            <p className='wechat-description'>{intl.get(MODULE, 3)/*_i18n:设置完成后，请参考（*/}<span className='wechat-clickModal' onClick={this.openModal}>{intl.get(MODULE, 4)/*_i18n:微信连Wi-Fi功能指引*/}</span>{intl.get(MODULE, 5)/*_i18n:）获取二维码*/}</p>
                            <label className='wechat-label'>{intl.get(MODULE, 6)/*_i18n:客用Wi-Fi名称*/}</label>
                            <FormItem className='wechat-formItem' type="small" showErrorTip={ssidTip}>
                                <Input type="text" value={ssid} onChange={value => this.onChange('ssid',value)} disabled={ssidDisabled} maxLength={32}/>
                                <span className='ssid-description'>{intl.get(MODULE, 7)/*_i18n:Wi-Fi名称必须以大写字母“WX”开头，示例：WX_SUNMI _Guest*/}</span>
                                <ErrorTip>{ssidTip}</ErrorTip>
                            </FormItem>
                            
                            <div className="wechat-label have-checkbox">
                                <label>{intl.get(MODULE, 8)/*_i18n:客用Wi-Fi密码*/}</label>
                                <Checkbox checked={encryption} onChange={this.changeEncryption} disabled={checkBoxDisabled}>{intl.get(MODULE, 9)/*_i18n:不设密码*/}</Checkbox>
                            </div>
                            <FormItem className='wechat-formItem' type="small" showErrorTip={pwdTip}>
                                <Input type="password" value={pwd} onChange={value => this.onChange('pwd',value)} disabled={pwdDisabled} maxLength={32}/>
                                <ErrorTip>{pwdTip}</ErrorTip>
                            </FormItem>
                        </Form>
                    </div>
                    <section className="save-area">
                        <Button
                            size="large"
                            onClick={this.setWechatInfo}
                            className='button'
                        >{intl.get(MODULE, 10)/*_i18n:保存*/}</Button>
                    </section>
                </div>
                <GuideModal visible={modalVisible} close={this.closeModal}/>
            </SubLayout>
        );
    }
}
const GuideModal = (props) => {
    const { visible, close } = props;
    const itemColor = '#6174F1';
    return (
        <Modal
            visible={visible}
            className='account-step-guide'
            width={824}
            centered
            closable={false}
            footer={null}
        >
            <div className='body'>
                <h4>{intl.get(MODULE, 11)/*_i18n:微信公众平台设置指引*/}</h4>
                <div className='content'>
                    <Timeline>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 12)/*_i18n:添加功能插件*/}</label>
                            <p>{intl.get(MODULE, 13)/*_i18n:用已有公众号（必须是服务号）或新注册账号*/}<a href='https://mp.weixin.qq.com' target='_blank'>{intl.get(MODULE, 14)/*_i18n:登录公众平台*/}</a>{intl.get(MODULE, 15)/*_i18n:，添加“*/}<b>{intl.get(MODULE, 16)/*_i18n:门店小程序*/}</b>{intl.get(MODULE, 17)/*_i18n:”和“*/}<b>{intl.get(MODULE, 18)/*_i18n:微信连Wi-Fi*/}</b>{intl.get(MODULE, 19)/*_i18n:”功能插件。*/}</p>
                            <img className='img-first' src={require('~/assets/images/add-feature.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 20)/*_i18n:添加门店*/}</label>
                            <p>{intl.get(MODULE, 21)/*_i18n:进入“*/}<b>{intl.get(MODULE, 22)/*_i18n:门店小程序*/}</b>{intl.get(MODULE, 23)/*_i18n:”插件，点击添加门店，按照指引添加完成。*/}</p>
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 24)/*_i18n:添加Wi-Fi设备*/}</label>
                            <p>{intl.get(MODULE, 25)/*_i18n:进入“微信连Wi-Fi”插件，选择“用户连网方式”，点击扫二维码连网中的“立即配置”，再点击“添加设备”；设备类型选择密码型设备；网络名（SSID）和密码分别输入客用Wi-Fi的名称和密码（当前客用Wi-Fi名称：WX_SUNMI_XX_Guest；密码：12345）*/}</p>
                            <img className='img-second' src={require('~/assets/images/add-wifi.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 26)/*_i18n:获取二维码*/}</label>
                            <p>{intl.get(MODULE, 27)/*_i18n:点击“添加”后，在弹窗提醒中点击“下一步”，下载二维码物料。*/}</p>
                            <img className='img-third' src={require('~/assets/images/get-qrcode.png')} />
                        </Timeline.Item>
                        <Timeline.Item color={itemColor}>
                            <label>{intl.get(MODULE, 28)/*_i18n:完成*/}</label>
                        </Timeline.Item>
                    </Timeline>
                </div>
            </div>
            <div className='footer'>
                <Button type='primary' onClick={close}>{intl.get(MODULE, 29)/*_i18n:我知道了*/}</Button>
            </div>
        </Modal>
    );
}
