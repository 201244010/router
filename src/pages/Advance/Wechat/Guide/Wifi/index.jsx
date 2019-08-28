
import React from 'react';
import { Button, Modal, message } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import CustomIcon from "~/components/Icon";
import { checkRange } from '~/assets/common/check';

import './wifi.scss';

const MODULE = 'wechatWifi';
const { FormItem, Input, ErrorTip } = Form;

export default class Wifi extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        onlineLimit: '',
        onlineLimitTip: '',
        idleLimit: '',
        idleLimitTip: '',
        loading: false,
        visible: false,
    }

    onChange = (name, value) => {
        const check = {
            onlineLimit:{
                func: checkRange,
                args: { min: 1, max: 1440, who: '上网时长' },
            },
            idleLimit:{
                func: checkRange,
                args: { min: 1, max: 1440, who: '空闲断线' },
            },
        }

        const tip = check[name].func(value, check[name].args);
        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        });
    }

    preStep = () => {
        const params = this.props.match.params;
        const { onlineLimit, idleLimit } = this.state;
        let data = { onlineLimit, idleLimit };

        window.sessionStorage.setItem('wechat.wifi', JSON.stringify(data));

        this.props.history.push(`/routersetting/wechat/setup/account/` + encodeURIComponent(params.param));
    }

    submit = async () => {
        const params = this.props.match.params;
        const { onlineLimit, idleLimit, ssidlist } = this.state;

        const param = JSON.parse(decodeURIComponent(params.param));
        // const { logo, welcome, btnStr, statement, ssid, shopId, appId, secretKey } = param;
        const { ssid, shopId, appId, secretKey } = param;

        let options = {
            enable: '1',
            online_limit: onlineLimit,
            idle_limit: idleLimit,
            // logo_info: logo,
            // welcome: welcome,
            // login_hint: btnStr,
            // statement: statement,
            ssid: ssid,
            shopid: shopId,
            appid: appId,
            secretkey: secretKey,
            ssidlist: ssidlist,
        };

        common.fetchApi(
            {
                opcode: 'AUTH_ENABLE_MSG',
                data: { ssid: ssid }
            }
        );

        this.setState({loading: true});
        let response = await common.fetchApi(
            {
                opcode: 'AUTH_WEIXIN_CONFIG_SET',
                data: { weixin: options }
            }
        );
        this.setState({loading: false});

        let { errcode } = response;
        if (0 === errcode) {
            this.setState({
                visible: true,
            });
            return ;
        }

        message.error(`未知错误[${errcode}]`);
    }

    close = () => {
        this.setState({
            visible: false,
        });
        this.props.history.push('/routersetting/wechat/status');    //跳转到status页面
    }

    async fetchConf() {
        let response = await common.fetchApi({ opcode: 'AUTH_WEIXIN_CONFIG_GET' });
        let { errcode, data } = response;

        if (0 === errcode) {
            const { online_limit, idle_limit, ssidlist } = data[0].result.weixin;
            this.setState({
                onlineLimit: online_limit,
                idleLimit: idle_limit,
                ssidlist: ssidlist,
            });
        }
    }

    componentDidMount() {
        const val = window.sessionStorage.getItem('wechat.wifi');

        if (val) {  //sessionStorage.getItem('wechat.wifi') 存在时
            const { onlineLimit,  idleLimit, ssidlist } = JSON.parse(val);
            this.setState({
                onlineLimit: onlineLimit,
                idleLimit: idleLimit,
                ssidlist: ssidlist,
            });
            return;
        }

        this.fetchConf();
    }

    render() {
        const { onlineLimit, onlineLimitTip, idleLimit, idleLimitTip, loading, visible } = this.state;
        const submitCheck = [ 'onlineLimit', 'idleLimit' ].some(item => {
            return this.state[item] === '' || this.state[item + 'Tip'] !== '';
        });
        const disabled = submitCheck;

        return (
            <React.Fragment>
                <div className='setup-content'>
                    <PanelHeader title={intl.get(MODULE, 0)/*_i18n:设置顾客上网时长*/} checkable={false}/>
                    <p className='help'>{intl.get(MODULE, 1)/*_i18n:设置顾客单次连接可上网的时长，超出时间或空闲时间达到所设置的时长都需要重新连接。*/}</p>
                    <Form style={{ margin: 0, padding: 0 }}>
                        <label>{intl.get(MODULE, 2)/*_i18n:顾客上网时长限制*/}</label>
                        <div className='form-item with-time-unit'>
                            <FormItem type="small" showErrorTip={onlineLimitTip} >
                                <Input type="text"
                                    maxLength={4}
                                    placeholder={intl.get(MODULE, 3)/*_i18n:请输入顾客上网时长*/}
                                    value={onlineLimit}
                                    onChange={(value)=>this.onChange('onlineLimit', value)}
                                />
                                <ErrorTip >{onlineLimitTip}</ErrorTip>
                            </FormItem>
                        </div>
                        <label>{intl.get(MODULE, 4)/*_i18n:空闲断网时长*/}</label>
                        <div className='form-item with-time-unit'>
                            <FormItem type="small" showErrorTip={idleLimitTip}>
                                <Input
                                    type="text"
                                    maxLength={4}
                                    placeholder={intl.get(MODULE, 5)/*_i18n:请输入空闲断网时长*/}
                                    value={idleLimit}
                                    onChange={(value)=>this.onChange('idleLimit', value)}
                                />
                                <ErrorTip >{idleLimitTip}</ErrorTip>
                            </FormItem>
                        </div>
                    </Form>
                </div>
                <section className="save-area">
                    <Button
                        size="large"
                        onClick={this.preStep}
                    >{intl.get(MODULE, 6)/*_i18n:上一步*/}</Button>
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        disabled={disabled}
                        onClick={this.submit}
                    >{intl.get(MODULE, 7)/*_i18n:完成*/}</Button>
                </section>
                <FinishModal visible={visible} close={this.close}/>
            </React.Fragment>
        );
    }
}

const FinishModal = (props) => {
    return (
        <Modal
            width={560}
            closable={false}
            visible={props.visible}
            maskClosable={false}
            centered={true}
            footer={
                <div className='finish-footer'>
                    <Button type='primary' size="large" className='footer-button' onClick={props.close}>{intl.get(MODULE, 8)/*_i18n:确定*/}</Button>
                </div>
            }>
                <div className="backup-icon">
                    <CustomIcon color="#87D068" type="succeed" size={64} />
                    <div className="backup-result">{intl.get(MODULE, 9)/*_i18n:设置完成!*/}</div>
                </div>
        </Modal>
    );
}
