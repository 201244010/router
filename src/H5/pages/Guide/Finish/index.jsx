import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Input from 'h5/components/Input';
import Button from 'h5/components/Button';

import { Base64 } from 'js-base64';

import './finish.scss';

const MODULE = 'h5finish';

export default class Finish extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    goHome = () => {
        this.props.history.push('/home');
    };

    render() {
        let data = { hostSsid: '', guestSsid: '', hostPassword: '', guestPassword: '', guestDisplay: 'none' };
        // let host = { ssid: '', password: ''};
        // let guest = { enable: '0', ssid: '', static_password: ''};


        const params = this.props.match.params;
        console.log(params);
        if (params && params.wifi) {
            const wifi = JSON.parse(decodeURIComponent(params.wifi));

            data = {
                hostSsid: wifi.hostSsid,
                guestSsid: wifi.guestSsid,
                hostPassword: wifi.hostPassword,
                guestPassword: wifi.guestPassword,
                guestDisplay: wifi.guestDisplay,
            };
        }

        return ([
            <div className='h5finish'>
                <div className='icon-success'></div>
                <p className='finish-tip'>路由器设置成功</p>
                <div className='deviceInfo'>
                    <div className='left'>
                        <div className='deviceImg'></div>
                        <span className='title-left'>{data.hostSsid}</span>
                    </div>
                    <div className='right'>
                        <span className='title-right'>备注位置</span>    
                    </div>
                </div>
                <div>
                    <p className='wifi-title'>商户Wi-Fi</p>
                    <div className='wifi-content'>
                        <div className='wifi-ssid'>
                            <span className='wifi-left'>商户Wi-iFi名称</span>
                            <span className='wifi-right'>{data.hostSsid}</span>
                        </div>
                        <div className='wifi-pwd'>
                            <span className='wifi-left'>商户Wi-Fi密码</span>
                            <span className='wifi-right'>{data.hostPassword}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <p className='wifi-title'>客用Wi-Fi</p>
                    <div className='wifi-content'>
                        <div className='wifi-ssid'>
                            <span className='wifi-left'>顾客Wi-iFi名称</span>
                            <span className='wifi-right'>{data.guestSsid}</span>
                        </div>
                        <div className='wifi-pwd'>
                            <span className='wifi-left'>顾客Wi-Fi密码</span>
                            <span className='wifi-right'>{data.guestPassword}</span>
                        </div>
                    </div>
                </div>
            </div>,
            <div className='foot'>
                <Button type='primary' className='goHome' onClick={this.goHome} >完成</Button>
                <Button type='primary' className='addMore' onClick={this.addMore} >添加更多路由器</Button>
            </div>
        ]);
    }
}