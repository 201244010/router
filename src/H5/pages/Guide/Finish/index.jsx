import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';

import { Base64 } from 'js-base64';

import './finish.scss';

const MODULE = 'finish';

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
                <GuideHeader title={intl.get(MODULE, 0)} />
                <form>
                    <WifiInfo
                        title={intl.get(MODULE, 1)}
                        ssid={host.ssid}
                        password={host.password}
                        color='rgba(255,96,0,0.60)'
                    />
                    { ('1' === guest.enable) &&
                    <WifiInfo
                        title={intl.get(MODULE, 2)}
                        ssid={guest.ssid}
                        password={guest.password}
                        color='rgba(45,187,26,0.60)'
                    />
                    }
                    <p className='tip-reconnect'>{intl.get(MODULE, 3)}</p>
                    <Button type='primary' onClick={this.nextStep}>{intl.get(MODULE, 4)}</Button>
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
                <li><label>{intl.get(MODULE, 5)}</label><span>{ssid}</span></li>
                <li>{(password && password.length > 0) ?
                    [<label>{intl.get(MODULE, 6)}</label>,<span>{password}</span>] :
                    <label>{intl.get(MODULE, 7)}</label>
                }</li>
            </ul>
        </div>
    );
}