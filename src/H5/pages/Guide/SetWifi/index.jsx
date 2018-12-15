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

        let next = () => {
            const param = JSON.stringify({ssid, password});
            this.props.history.push('/guide/guest/' + param);
        };

        if ('' === password) {
            confirm({
                title: '提示：',
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
                <GuideHeader title='设置商户Wi-Fi' tips='这是说明文字这是说明文字这是说明文字' />
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
                    <Button type='primary' onClick={this.nextStep} disabled={disabled}>下一步</Button>
                </form>
            </div>
        )
    }
}