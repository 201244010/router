import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';
import Link from 'h5/components/Link';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/confirm';
import toast from 'h5/components/toast';

import { Base64 } from 'js-base64';
import { checkStr } from '~/assets/common/check';
import { TIME_WIFI_RELOAD } from '~/assets/common/constants';

const MODULE = 'guest';

export default class Guest extends React.Component {
    constructor(props) {
        super(props);
    }

    guest = {};     // 客用WiFi配置

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
                args: { who: intl.get(MODULE, 0), min: 1, max: 32, type: 'all', byte: true },
            },
            password: {
                func: (value) => {
                    if ('' == value) {
                        // Wi-Fi密码可以为空
                        return '';
                    } else if ('' == value.trim()) {
                        return intl.get(MODULE, 1);
                    } else {
                        return checkStr(value, { who: intl.get(MODULE, 2), min: 8, max: 32, type: 'english', byte: true });
                    }
                },
            }
        };

        this.setState({
            [key]: value,
            [key + 'Tip']: checkMap[key].func(value, checkMap[key].args),
        });
    }

    /**
     * laterSet: 不设置客用WiFi
     */
    submitData = async (laterSet = false) => {
        let data = {};

        // 客用WiFi配置
        let guest;
        if (laterSet) {
            guest = this.guest;
        } else {
            const { ssid, password } = this.state;
            let encryption = ('' === password) ? 'none' : 'psk-mixed/ccmp+tkip';
            let pwdBase64 = Base64.encode(password);
            guest = Object.assign(this.guest, {
                enable: '1',
                ssid: ssid,
                encryption: encryption,
                static_password: pwdBase64,
            });
        }

        data.guest = guest;

        // 商户WiFi配置
        const params = this.props.match.params;
        if (params && params.wifi) {
            const wifi = JSON.parse(decodeURIComponent(params.wifi));
            data.main = wifi;
        }

        // submit data
        this.setState({ loading : true});
        const res = await common.fetchApi({ opcode: 'WIRELESS_SET', data: data });

        const errcode = res.errcode;
        if (0 !== errcode) {
            this.setState({ loading : false});
            toast({tip: intl.get(MODULE, 3, {error: errcode})});
            return;
        }

        setTimeout(() => {
            console.log('wifi main config: ', data);
            const param = JSON.stringify(data);
            this.props.history.push('/guide/finish/' + encodeURIComponent(param));
        }, TIME_WIFI_RELOAD * 1000);
    }

    nextStep = () => {
        if ('' === this.state.password) {
            confirm({
                content: intl.get(MODULE, 4),
                onOk: this.submitData,
            });
        } else {
            this.submitData();
        }
    };

    laterSet = () => {
        this.submitData(true);
    }

    fetchData = async () => {
        let response = await common.fetchApi({ opcode: 'WIRELESS_GET' });
        let { errcode, data } = response;
        if(errcode == 0){
            let { ssid, static_password } = data[0].result.guest;
            this.setState({
                ssid,
                password: static_password,
            });
            this.guest = data[0].result.guest;
        }
    }

    componentDidMount() {
        this.fetchData();
        const params = this.props.match.params;
        if (params && params.wifi) {
            this.hostSSID = JSON.parse(decodeURIComponent(params.wifi)).host.band_2g.ssid;
        }
    }

    render() {
        let { ssid, ssidTip, password, passwordTip, loading } = this.state;

        let disabled = [ssidTip, passwordTip].some(tip => {
            return (tip.length > 0);
        });

        if( ssid === this.hostSSID){    //客用Wi-Fi与商户Wi-Fi名称相同的情况
            disabled = true;
            ssidTip = intl.get(MODULE, 5);
        }

        return (
            <div>
                <GuideHeader title={intl.get(MODULE, 6)} tips={intl.get(MODULE, 7)} />
                <Loading visible={loading} content={intl.get(MODULE, 8)} />
                <form>
                    <Form
                        value={ssid}
                        placeholder={intl.get(MODULE, 9)}
                        maxLength={32}
                        tip={ssidTip}
                        onChange={value => this.onChange('ssid', value)}
                    />
                    <Form
                        value={password}
                        type='password'
                        placeholder={intl.get(MODULE, 10)}
                        maxLength={32}
                        tip={passwordTip}
                        onChange={value => this.onChange('password', value)}
                    />
                    <Button type='primary' loading={loading} onClick={this.nextStep} disabled={disabled}>{intl.get(MODULE, 11)}</Button>
                    <div className='bottom-link'>
                        <Link onClick={this.laterSet}>{intl.get(MODULE, 12)}</Link>
                    </div>
                </form>
            </div>
        )
    }
}