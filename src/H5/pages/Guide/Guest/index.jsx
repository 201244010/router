import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';
import Link from 'h5/components/Link';
import confirm from 'h5/components/confirm';
import { message } from 'antd';

import { Base64 } from 'js-base64';
import { checkStr } from '~/assets/common/check';

export default class Guest extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        ssid: '',
        ssidTip: '',
        password: '',
        passwordTip: '',
        loading: false,
    }

    onChange = (key, value) => {
        const checkMap = {
            ssid: {
                func: checkStr,
                args: { who: 'Wi-Fi名称', min: 1, max: 32, type: 'all' },
            },
            password: {
                func: (value) => {
                    if ('' == value) {
                        // Wi-Fi密码可以为空
                        return '';
                    } else if ('' == value.trim()) {
                        return 'Wi-Fi密码不能全为空格';
                    } else {
                        return checkStr(value, { who: 'Wi-Fi密码', min: 8, max: 32, type: 'english' });
                    }
                },
            }
        };

        this.setState({
            [key]: value,
            [key + 'Tip']: checkMap[key].func(value, checkMap[key].args),
        });
    }

    submitData = async () => {
        const { ssid, password } = this.state;
        let encryption = ('' === password) ? 'none' : 'psk-mixed/ccmp+tkip';
        let pwdBase64 = Base64.encode(password);

        let data = {
            guest: {
                enable: '1',
                ssid: ssid,
                encryption: encryption,
                static_password: pwdBase64,
            }
        };

        // 商户WiFi配置
        const params = this.props.match.params || {};
        if (params && params.wifi) {
            let wifi = JSON.parse(this.props.match.params.wifi) || {};
            let {ssid, password} = wifi;
            if (ssid && password) {
                let encryption = ('' === password) ? 'none' : 'psk-mixed/ccmp+tkip';
                let pwdBase64 = Base64.encode(password);

                data.main = {
                    host: {
                        band_2g: {
                            enable: '1',
                            ssid,
                            encryption,
                            password: pwdBase64,
                        },
                        band_5g: {
                            ssid: ssid + '_5G',
                            encryption,
                            password: pwdBase64,
                        },
                    }
                }
            }
        }

        // submit data
        this.setState({ loading : true});
        const res = await common.fetchApi({ opcode: 'WIRELESS_SET', data: data });
        this.setState({ loading : false});

        const errcode = res.errcode;
        if(errcode === 0){
            console.log('wifi saved');
            //TODO
        } else {
            // TODO
            message.error(`未知错误[${errcode}]`);
        }
    }

    nextStep = () => {
        if ('' === this.state.password) {
            confirm({
                title: '提示：',
                content: '顾客Wi-Fi密码未设置，确定继续?',
                onOk: this.submitData,
            });
        } else {
            this.submitData();
        }
    };

    fetchData = async () => {
        let response = await common.fetchApi({ opcode: 'WIRELESS_GET' });
        let { errcode, data } = response;
        if(errcode == 0){
            let { ssid, static_password } = data[0].result.guest;
            this.setState({
                ssid,
                password: static_password,
            });
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const { ssid, ssidTip, password, passwordTip, loading } = this.state;

        let disabled = [ssidTip, passwordTip].some(tip => {
            return (tip.length > 0);
        });

        return (
            <div>
                <GuideHeader title='设置顾客Wi-Fi' tips='这是说明文字这是说明文字这是说明文字' />
                <form>
                    <Form
                        value={ssid}
                        placeholder='请设置Wi-Fi名称'
                        tip={ssidTip}
                        onChange={value => this.onChange('ssid', value)}
                    />
                    <Form
                        value={password}
                        type='password'
                        placeholder='请设置Wi-Fi密码'
                        tip={passwordTip}
                        onChange={value => this.onChange('password', value)}
                    />
                    <Button type='primary' loading={loading} onClick={this.nextStep} disabled={disabled}>下一步</Button>
                    <div className='bottom-link'>
                        <Link onClick={this.nextStep}>稍后设置</Link>
                    </div>
                </form>
            </div>
        )
    }
}