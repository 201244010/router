import React from 'react';
import Button from 'h5/components/Button';
import Icon from 'h5/components/Icon';

import { UA, PAGE_STYLE_KEY, PAGE_STYLE_WEB } from '~/utils';

import './home.scss';

export default class Home extends React.PureComponent{
    constructor(props){
        super(props);
    }

    downloadApp = () => {
        location.href = 'https://webapi.sunmi.com/webapi/wap/web/appstore/1.0/?service=AppStore.getAppFromHome';
    }

    openApp = () => {
        const { iPhone, iPad, iPod } = UA;
        if (iPhone || iPad || iPod) {
            location.href = 'sunmiapp://';
        } else {
            location.href = 'xl://sunmi:8080/androidapp';
        }
    }

    goWeb = () => {
        try {
            window.sessionStorage.setItem(PAGE_STYLE_KEY, PAGE_STYLE_WEB);
        } catch (e) {
            console.error('sessionStorage disabled');
        }

        window.location.href = '/';
    }

    render() {
        return (
            <div className="home">
                <Icon type='earth' size={'6.9333rem'} style={{
                    color: '#FFF',
                    opacity: 0.1,
                    position: 'fixed',
                    top: '-1.8667rem',
                    left: '-2.3067rem',
                    zIndex: '-1'
                }} />
                <h2>欢迎使用商米路由器</h2>
                <p>下载商米助手APP，随时随地管理您的网络</p>
                <div><Button onClick={this.downloadApp} className='download' type='primary'>下载APP</Button></div>
                <div><Button onClick={this.openApp}>已安装，直接打开</Button></div>
                <div className='web-config'>
                    <a onClick={this.goWeb} href="javascript:void(0);">进入网页版配置</a>
                </div>
                <Icon type='earth' size={'10.6667rem'} style={{
                    color: '#FFF',
                    opacity: 0.06,
                    position: 'fixed',
                    bottom: '-1.7333rem',
                    right: '-4rem',
                    zIndex: '-1'
                }} />
            </div>
        );
    }
}
