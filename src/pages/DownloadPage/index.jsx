import React, {PureComponent} from 'react';
import './downloadPage.scss';

export default function DownloadPage() {
    return (
        <div className='app-download ui-container'>
            <div className='app-header'>
                <div className='title'>
                    <h1>商米助手APP</h1>
                    <p>下载商米助手APP，支持本地和远程管理路由器，随时随地查看店铺设备状态</p>
                </div>
                <div className='QRcode'>
                    <img className='QRcode-img' src={require('~/assets/images/qr.png')} />
                    <p>扫码下载APP</p>
                </div>
            </div>
            <ul className='app-body'>
                {
                    [
                        { img: require('~/assets/images/remotecontrol.png'), h2: '远程管理', desc: '用手机随时随地轻松管理网络'},
                        { img: require('~/assets/images/grouping.png'), h2: '分组管理', desc: '添加自定义店铺，分组管理设备' },
                        { img: require('~/assets/images/terminal.png'), h2: '终端管理', desc: '轻松管理联网终端，支持一键优先/禁止上网' },
                        { img: require('~/assets/images/route.png'), h2: '路由设置', desc: '支持多功能设置，全面管理路由器' }
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
