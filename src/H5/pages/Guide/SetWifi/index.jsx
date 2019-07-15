import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Input from 'h5/components/Input';
import Button from 'h5/components/Button';
import confirm from 'h5/components/confirm';

import { Base64 } from 'js-base64';
import { checkStr } from '~/assets/common/check';

import './h5setwifi.scss';

const MODULE = 'h5setwifi';

export default class SetWifi extends React.Component {
    constructor(props) {
        super(props);
    }

    main = {};      // 商户WiFi配置

    state = {
        hostSsid: '',
        hostSsidTip: '',
        hostPassword: '',
        hostPasswordTip: '',
        guestSsid: '',
        guestSsidTip: '',
        guestPassword: '',
        guestPasswordTip: '',
        guestDisplay: 'none',
        setMessage: intl.get(MODULE, 11),
    }

    onChange = (key, value) => {
        const checkMap = {
            hostSsid: {
                func: checkStr,
                args: { who: intl.get(MODULE, 0)/*_i18n:Wi-Fi名称*/, min: 1, max: 32, type: 'all', byte: true },
            },
            hostPassword: {
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
            },
            guestSsid: {
                func: checkStr,
                args: { who: intl.get(MODULE, 0)/*_i18n:Wi-Fi名称*/, min: 1, max: 32, type: 'all', byte: true },
            },
            guestPassword: {
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

    setGuest = () => {
        let {guestDisplay} = this.state;
        this.setState({
            guestDisplay: 'none' === guestDisplay ? 'block' : 'none',
            setMessage: 'none' === guestDisplay ? intl.get(MODULE, 10) : intl.get(MODULE, 11)
        });
    }

    dataSet = async() =>{
        let { hostSsid, guestSsid, hostPassword, guestPassword, guestDisplay } = this.state;
        if ('block' === guestDisplay) {
            this.guestWireLess.ssid = guestSsid;
            this.guestWireLess.static_password = Base64.encode(guestPassword);
            this.guestWireLess.enable = '1';
            this.guestWireLess.encryption = guestPassword.length === 0 ? 'none':'psk-mixed/ccmp+tkip';
        }
        
        this.mainWireLess.host.band_2g.ssid = hostSsid;
        this.mainWireLess.host.band_2g.password = Base64.encode(hostPassword);
        this.mainWireLess.host.band_5g.ssid = hostSsid.substring(0,29) + '_5G';
        this.mainWireLess.host.band_5g.password = Base64.encode(hostPassword);
        this.mainWireLess.host.band_2g.encryption = hostPassword.length === 0 ?'none':'psk-mixed/ccmp+tkip';
        this.mainWireLess.host.band_5g.encryption = hostPassword.length === 0 ?'none':'psk-mixed/ccmp+tkip';
        this.mainWireLess.host.band_2g.enable = "1";

        let data = { hostSsid, guestSsid, hostPassword, guestPassword, guestDisplay };
        let param = JSON.stringify(data);

        let response = await common.fetchApi(
            [{
                opcode: 'WIRELESS_SET',
                data: { main : this.mainWireLess, guest : this.guestWireLess}
            }]
        );
        this.setState({ loading : false});
        
        let {errcode} = response;
        if(errcode === 0){
            this.props.history.push('/guide/finish/' + encodeURIComponent(param));
        } else {
            // message.error(`Wi-Fi设置失败[${errorMessage[errcode] || errcode}]`);
            message.error(intl.get(MODULE, 9, {error: errorMessage[errcode] || errcode})/*_i18n:Wi-Fi设置失败[{error}]*/);
        }
        
    }
    
    nextStep = () => {
        const {hostPassword, guestPassword, guestDisplay } = this.state;

        if(hostPassword.length === 0 || ('block' === guestDisplay && guestPassword.length === 0)){
            confirm({
                content: (hostPassword.length === 0 ? intl.get(MODULE, 12) : '') + 
                (hostPassword.length === 0 && guestPassword.length === 0 && 'block' === guestDisplay? '、' : '')+
                (guestPassword.length === 0 && 'block' === guestDisplay? intl.get(MODULE, 13) : '') + intl.get(MODULE, 14),
                onOk: this.dataSet,
            });
            this.setState({ loading : false }); 
        }else{
            this.dataSet();
        }
    };

    fetchData = async () => {
        let response = await common.fetchApi({ opcode: 'WIRELESS_GET' });
        let { errcode, data } = response;
        if(errcode == 0){
            let { main, guest } = data[0].result;
            this.mainWireLess = main;
            this.hostWireLess = main.host.band_2g;
            this.guestWireLess = guest;
            this.setState({
                hostSsid : this.hostWireLess.ssid,
                hostPassword : Base64.decode(this.hostWireLess.password),
                guestSsid : this.guestWireLess.ssid,
                guestPassword : Base64.decode(guest.static_password)   
            });
            return;
        }
        message.error(intl.get(MODULE, 15));
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        let { hostSsid, hostSsidTip, hostPassword, hostPasswordTip, guestSsid, guestSsidTip, guestPassword, guestPasswordTip, guestDisplay, setMessage } = this.state;

        if ('none' === guestDisplay) {
            guestSsidTip = '';
            guestPasswordTip = '';
        }

        let tipCheck = [hostSsidTip, hostPasswordTip, guestSsidTip, guestPasswordTip].some(tip => {
            return ('' !== tip);
        });

        let disabled = tipCheck || '' === hostSsid || ('' === guestSsid && 'block' === guestDisplay);

        return ([
            <div className='guide-upper'>
                <GuideHeader title={intl.get(MODULE, 4)/*_i18n:设置商户Wi-Fi*/} tips='' />
                <form className='h5setwifi'>
                    <Input
                        inputName={intl.get(MODULE, 16)}
                        value={hostSsid}
                        placeholder={intl.get(MODULE, 18)}
                        maxLength={32}
                        tip={hostSsidTip}
                        onChange={value => this.onChange('hostSsid', value)}
                        style={{marginBottom: '0.4267rem'}}
                    />
                    <Input
                        value={hostPassword}
                        type='password'
                        placeholder={intl.get(MODULE, 19)}
                        maxLength={32}
                        tip={hostPasswordTip}
                        onChange={value => this.onChange('hostPassword', value)}
                    />
                    <Input
                        inputName={intl.get(MODULE, 20)}
                        value={guestSsid}
                        placeholder={intl.get(MODULE, 21)}
                        maxLength={32}
                        tip={guestSsidTip}
                        onChange={value => this.onChange('guestSsid', value)}
                        style={{marginBottom: '0.4267rem',display: guestDisplay}}
                    />
                    <Input
                        value={guestPassword}
                        type='password'
                        placeholder={intl.get(MODULE, 22)}
                        maxLength={32}
                        tip={guestPasswordTip}
                        onChange={value => this.onChange('guestPassword', value)}
                        style={{marginBottom: '0.4267rem',display: guestDisplay}}
                    />
                    <p className='setGuest' onClick={this.setGuest}>{setMessage}</p>
                </form>
            </div>,
            <div className='h5-next'>
                <Button type='primary' onClick={this.nextStep} disabled={disabled}>{intl.get(MODULE, 8)/*_i18n:下一步*/}</Button>
            </div>    
        ]);
    }
}