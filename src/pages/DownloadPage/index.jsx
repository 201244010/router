import React, {PureComponent} from 'react';

import './downloadPage.scss';

const MODULE = 'downloadpage';

export default function DownloadPage() {
    return (
        <div className='app-download ui-container' style={{marginTop: 8}}>
            <div className='app-header'>
                <div className='title'>
                    <h1>{intl.get(MODULE, 0)/*_i18n:商米助手APP*/}</h1>
                    <p>{intl.get(MODULE, 1)/*_i18n:下载商米助手APP，支持本地和远程管理路由器，随时随地查看店铺设备状态*/}</p>
                </div>
                <div className='QRcode'>
                    <img className='QRcode-img' src={require('~/assets/images/qr.png')} />
                    <p>{intl.get(MODULE, 2)/*_i18n:扫码下载*/}</p>
                </div>
            </div>
            <ul className='app-body'>
                {
                    [
                        { img: require('~/assets/images/remotecontrol.png'), h2: intl.get(MODULE, 3)/*_i18n:远程管理*/, desc: intl.get(MODULE, 4)/*_i18n:用手机随时随地轻松管理网络*/},
                        { img: require('~/assets/images/grouping.png'), h2: intl.get(MODULE, 5)/*_i18n:分组管理*/, desc: intl.get(MODULE, 6)/*_i18n:添加自定义店铺，分组管理设备*/ },
                        { img: require('~/assets/images/terminal.png'), h2: intl.get(MODULE, 7)/*_i18n:终端管理*/, desc: intl.get(MODULE, 8)/*_i18n:轻松管理联网终端，支持一键优先/禁止上网*/ },
                        { img: require('~/assets/images/route.png'), h2: intl.get(MODULE, 9)/*_i18n:路由设置*/, desc: intl.get(MODULE, 10)/*_i18n:支持多功能设置，全面管理路由器*/ }
                    ].map((item, index) => {
                        return (
                            <li key={index}>
                                <div className='image' style={{ backgroundImage: `url(${item.img})` }}></div>
                                <div className='summary'>
                                    <h2>{item.h2}</h2>
                                    <p>{item.desc}</p>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </div>);  
}
