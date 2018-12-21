import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';
import confirm from 'h5/components/confirm';

import { Base64 } from 'js-base64';
import { checkStr } from '~/assets/common/check';

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
                content: '商户Wi-Fi密码未设置，确定继续?',
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
                <GuideHeader title='设置商户Wi-Fi' tips='请设置您为自己或店员开放的个人Wi-Fi名称与密码' />
                <form>
                    <Form
                        value={ssid}
                        placeholder='请设置Wi-Fi名称'
                        maxLength={32}
                        tip={ssidTip}
                        onChange={value => this.onChange('ssid', value)}
                    />
                    <Form
                        value={password}
                        type='password'
                        placeholder='请设置Wi-Fi密码'
                        maxLength={32}
                        tip={passwordTip}
                        onChange={value => this.onChange('password', value)}
                    />
                    <Button type='primary' onClick={this.nextStep} disabled={disabled}>下一步</Button>
                </form>
            </div>
        )
    }
}