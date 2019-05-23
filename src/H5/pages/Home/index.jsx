import React from 'react';
import Button from 'h5/components/Button';
import Icon from 'h5/components/Icon';
import Link from 'h5/components/Link';

import { UA, PAGE_STYLE_KEY, PAGE_STYLE_WEB } from '~/utils';

import style from './home.useable.scss';

const MODULE = 'h5home';

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

    componentDidMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        return (
            <div className="h5home-main">
                <div className="home">
                    <Icon type='earth' size={'6.9333rem'} style={{
                        color: '#FFF',
                        opacity: 0.1,
                        position: 'fixed',
                        top: '-1.8667rem',
                        left: '-2.3067rem',
                        zIndex: '-1'
                    }} />
                    <h2>{intl.get(MODULE, 0)/*_i18n:欢迎使用商米路由器*/}</h2>
                    <p>{intl.get(MODULE, 1)/*_i18n:下载商米助手APP，随时随地管理您的网络*/}</p>
                    <div><Button onClick={this.downloadApp} className='download' type='primary'>{intl.get(MODULE, 2)/*_i18n:下载APP*/}</Button></div>
                    <div><Button onClick={this.openApp}>{intl.get(MODULE, 3)/*_i18n:已安装，直接打开*/}</Button></div>
                    <div className='web-config'>
                        <Link onClick={this.goWeb}>{intl.get(MODULE, 4)/*_i18n:进入网页版配置*/}</Link>
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
            </div>
        );
    }
}
