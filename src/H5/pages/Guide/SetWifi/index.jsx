import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';
import confirm from 'h5/components/confirm';

import { Base64 } from 'js-base64';
import { checkStr } from '~/assets/common/check';

const MODULE = 'h5setwifi';

export default class SetWifi extends React.Component {
    constructor(props) {
        super(props);
    }

    main = {};      // 商户WiFi配置

    state = {
        ssid: '',
        ssidTip: '',
        password: '',
        passwordTip: '',
    }

    onChange = (key, value) => {
        const checkMap = {
            ssid: {
                func: checkStr,
                args: { who: intl.get(MODULE, 0)/*_i18n:Wi-Fi名称*/, min: 1, max: 32, type: 'all', byte: true },
            },
            password: {
                func: (value) => {
                    if ('' == value) {
                        // Wi-Fi密码可以为空
                        return '';
                    } else if ('' == value.trim()) {
                        return intl.get(MODULE, 1)/*_i18n:Wi-Fi密码不能全为空格*/;
                    } else {
                        return checkStr(value, { who: intl.get(MODULE, 2)/*_i18n:Wi-Fi密码*/, min: 8, max: 32, type: 'english', byte: true });
                    }
                },
            }
        };

        this.setState({
            [key]: value,
            [key + 'Tip']: checkMap[key].func(value, checkMap[key].args),
        });
    }

    nextStep = () => {
        const { ssid, password } = this.state;
        let encryption = ('' === password) ? 'none' : 'psk-mixed/ccmp+tkip';
        let pwdBase64 = Base64.encode(password);

        let next = () => {
            let band2 = Object.assign(
                this.main.host.band_2g,
                {
                    enable: '1',
                    ssid,
                    encryption,
                    password: pwdBase64,
                }
            );
            this.main.host.band_2g = band2;

            let band5 = Object.assign(
                this.main.host.band_5g,
                {
                    ssid: ssid.substring(0,29) + "_5G",
                    encryption,
                    password: pwdBase64,
                }
            );
            this.main.host.band_5g = band5;

            console.log('wifi main config: ', this.main);
            const param = JSON.stringify(this.main);
            this.props.history.push('/guide/guest/' + encodeURIComponent(param));
        };

        if ('' === password) {
            confirm({
                //title: '提示',
                content: intl.get(MODULE, 3)/*_i18n:商户Wi-Fi未设置密码，存在安全风险，确定不设置？*/,
                onOk: next,
            });
        } else {
            next();
        }
    };

    fetchData = async () => {
        let response = await common.fetchApi({ opcode: 'WIRELESS_GET' });
        let { errcode, data } = response;
        if(errcode == 0){
            let { ssid, password } = data[0].result.main.host.band_2g;
            this.setState({
                ssid,
                password,
            });

            this.main = data[0].result.main;
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const { ssid, ssidTip, password, passwordTip } = this.state;

        let disabled = [ssidTip, passwordTip].some(tip => {
            return (tip.length > 0);
        });

        return (
            <div>
                <GuideHeader title={intl.get(MODULE, 4)/*_i18n:设置商户Wi-Fi*/} tips={intl.get(MODULE, 5)/*_i18n:请设置您为自己或店员开放的个人Wi-Fi名称与密码*/} />
                <form>
                    <Form
                        value={ssid}
                        placeholder={intl.get(MODULE, 6)/*_i18n:请设置Wi-Fi名称*/}
                        maxLength={32}
                        tip={ssidTip}
                        onChange={value => this.onChange('ssid', value)}
                    />
                    <Form
                        value={password}
                        type='password'
                        placeholder={intl.get(MODULE, 7)/*_i18n:请设置Wi-Fi密码*/}
                        maxLength={32}
                        tip={passwordTip}
                        onChange={value => this.onChange('password', value)}
                    />
                    <Button type='primary' onClick={this.nextStep} disabled={disabled}>{intl.get(MODULE, 8)/*_i18n:下一步*/}</Button>
                </form>
            </div>
        )
    }
}