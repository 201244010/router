import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';

import { Base64 } from 'js-base64';

import './finish.scss';

export default class Finish extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    nextStep = () => {
        this.props.history.push('/home');
    };

    render() {
        let host = { ssid: '', password: ''};
        let guest = { enable: '0', ssid: '', static_password: ''};


        const params = this.props.match.params;
        if (params && params.wifi) {
            const wifi = JSON.parse(decodeURIComponent(params.wifi));

            const band2 = wifi.main.host.band_2g;
            host = {
                ssid: band2.ssid,
                password: Base64.decode(band2.password),
            };

            guest = {
                enable: wifi.guest.enable,
                ssid: wifi.guest.ssid,
                password: Base64.decode(wifi.guest.static_password),
            };
        }

        return (
            <div className='finish-wrap'>
                <GuideHeader title='设置完成' />
                <form>
                    <WifiInfo
                        title='商户Wi-Fi'
                        ssid={host.ssid}
                        password={host.password}
                        color='rgba(255,96,0,0.60)'
                    />
                    { ('1' === guest.enable) &&
                    <WifiInfo
                        title='顾客Wi-Fi'
                        ssid={guest.ssid}
                        password={guest.password}
                        color='rgba(45,187,26,0.60)'
                    />
                    }
                    <p className='tip-reconnect'>Wi-Fi可能会断开，如有需要请重新连接</p>
                    <Button type='primary' onClick={this.nextStep}>完成</Button>
                </form>
            </div>
        )
    }
}

const WifiInfo = function(props) {
    const { title, ssid, password, color } = props;
    return (
        <div className='sm-wifi-info-wrap'>
            <div className='info-header'>
                <i className='circle outer' style={{background: color}}>
                    <i className='circle inner' style={{background: color}}></i>
                </i>
                <h4 className='title'>{title}</h4>
            </div>
            <ul className='info-list'>
                <li><label>名称：</label><span>{ssid}</span></li>
                <li>{(password && password.length > 0) ?
                    [<label>密码：</label>,<span>{password}</span>] :
                    <label>无密码</label>
                }</li>
            </ul>
        </div>
    );
}