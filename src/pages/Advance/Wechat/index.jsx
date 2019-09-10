import React from 'react';
import { Button, Checkbox, message } from 'antd';
import { Base64 } from 'js-base64';
import Form from "~/components/Form";
import { checkStr } from '~/assets/common/check';
import PanelHeader from '~/components/PanelHeader';
import SubLayout from '~/components/SubLayout';
import GuideModal from './GuideModal';

import './index.scss';

const MODULE = 'wechatConnectWifi';
const {FormItem, ErrorTip, Input} = Form;

export default class Wechat extends React.Component {
    state = {
        enable: true,
        ssidDisabled: false,
        pwdDisabled: false,
        checkBoxDisabled: false,
        saveDisable: false,
        ssid: '',
        ssidTip: '',
        pwd: '',
        pwdTip: '',
    }

    changeEnable = value => {
        this.setState({
            enable: value,
            checkBoxDisabled: !value,
            ssidDisabled: !value,
            pwdDisabled: !value,
        }, () => {
            const { ssidDisabled, ssid, pwdDisabled, pwd } = this.state;
            const ssidTip = ssidDisabled ? '' : checkStr(ssid, { who: intl.get(MODULE, 0)/*_i18n:客用Wi-Fi名称*/, min: 1, max: 32, type: 'wechat', byte: true });
            const pwdTip = pwdDisabled ? '' : checkStr(pwd, { who: intl.get(MODULE, 1)/*_i18n:客用Wi-Fi密码*/, min:8 , max: 32, type: 'english', byte: true });
            this.setState({
                ssidTip: ssidTip,
                pwdTip: pwdTip,
                saveDisable: ssidTip !== '' || pwdTip !== '',
            })
        });
    }

    // changeEncryption = e => {
    //     const { enable } = this.state;
    //     this.setState({
    //         encryption: e.target.checked,
    //         pwdDisabled: !enable || e.target.checked,
    //     }, () => {
    //         const { pwdDisabled, pwd, ssidTip } = this.state;
    //         const pwdTip = pwdDisabled ? '' : checkStr(pwd, { who: intl.get(MODULE, 1)/*_i18n:客用Wi-Fi密码*/, min:8 , max: 32, type: 'english', byte: true });
    //         this.setState({
    //             pwdTip: pwdTip,
    //             saveDisable: ssidTip !== '' || pwdTip !== '',
    //         })
    //     });
    // }

    onChange = (type, value) => {
        const field = {
            ssid: {
                name: 'ssidTip',
                content: checkStr(value, { who: intl.get(MODULE, 0)/*_i18n:客用Wi-Fi名称*/, min: 1, max: 32, type: 'wechat', byte: true }),
            },
            pwd: {
                name: 'pwdTip',
                content: checkStr(value, { who: intl.get(MODULE, 1)/*_i18n:客用Wi-Fi密码*/, min:8 , max: 32, type: 'english', byte: true }),
            },
        };

        this.setState({
            [type]: value,
            [field[type].name]: field[type].content,
        }, () => {
            const { ssidTip, pwdTip } = this.state;
            this.setState({
                saveDisable: ssidTip !== '' || pwdTip !== '',
            });
        });
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
            const { guest: { ssid = '', enable = '', static_password = '', encryption = 'psk-mixed/ccmp+tkip'} = {} } = data[0].result;
            this.guestData = data[0].result.guest;
            this.mainData = data[0].result.main;
            const ssidDisabled = enable === '1'? false : true;
            const pwdDisabled = !(enable === '1');
            const ssidTip = ssidDisabled? '' : checkStr(ssid, { who: intl.get(MODULE, 0)/*_i18n:客用Wi-Fi名称*/, min: 1, max: 32, type: 'wechat', byte: true });
            const pwdTip = pwdDisabled? '' : checkStr(static_password, { who: intl.get(MODULE, 1)/*_i18n:客用Wi-Fi密码*/, min:8 , max: 32, type: 'english', byte: true });
            this.setState({
                ssid: ssid,
                enable: enable === '1'? true : false,
                pwd: Base64.decode(static_password),
                ssidDisabled: ssidDisabled,
                checkBoxDisabled: enable === '1'? false : true,
                pwdDisabled: pwdDisabled,
                ssidTip: ssidTip,
                pwdTip: pwdTip,
                saveDisable: ssidTip !== '' || pwdTip !== '',
            });
        }
    }

    setWechatInfo = async() => {
        const { ssid, enable, pwd } = this.state;

        const response = await common.fetchApi(
            [{
                opcode: 'WIRELESS_SET',
                data: { 
                    guest: {
                        ssid: ssid,
                        password: Base64.encode(pwd),
                        static_password: Base64.encode(pwd),
                        encryption: enable? 'psk-mixed/ccmp+tkip' : 'none',
                        password_type: 'static',
                        enable: enable? '1': '0',
                        period: this.guestData.period
                    },
                    main: this.mainData,
                }
            }]
        );
        const { errcode } = response;
        if(errcode === 0){
            message.success(intl.get(MODULE, 30)/*_i18n:设置完成*/)
        } else {
            message.error(intl.get(MODULE, 31)/*_i18n:设置失败*/)
        }
    }

    componentDidMount() {
        this.getWechatInfo();
    }
    render() {
        const { enable, ssid, ssidTip, pwd, pwdTip, ssidDisabled, pwdDisabled, checkBoxDisabled, modalVisible, saveDisable } = this.state;
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
                            <label className='wechat-label'>{intl.get(MODULE, 8)/*_i18n:客用Wi-Fi密码*/}</label>
                            <FormItem className='wechat-formItem' type="small" showErrorTip={pwdTip}>
                                <Input type="password" value={pwd} onChange={value => this.onChange('pwd',value)} disabled={pwdDisabled} maxLength={32}/>
                                <ErrorTip>{pwdTip}</ErrorTip>
                            </FormItem>
                        </Form>
                    </div>
                    <section className="save-area">
                        <Button
                            size="large"
                            type="primary"
                            disabled={saveDisable}
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
