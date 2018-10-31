import React,{Component} from 'react';
import './downloadPage.scss';

export default class DownloadPage extends Component{
    
    render(){
        return(
        <div className='app-download ui-container'>
            <div className='app-header'>
                <div className='title'>
                    <h1>商米管家APP</h1>
                    <p>下载商米管家APP，支持本地和远程管理路由器，随时随地查看店铺设备状态。</p>
                </div>
                <div className='QRcode'>
                    <img className='QRcode-img' src={require('~/assets/images/qr.png')} />
                    <p>扫码下载APP</p>
                </div>
            </div>
            <div className='app-body'>
                <ul style={{marginBottom:59}}>
                    <li>
                        <div className='category'>
                            <div className='image' style={{backgroundImage:"url(" + require("~/assets/images/remotecontrol.png") + ")"}}>
                            </div>
                            <div className='summary'>
                                <h2>远程管理</h2>
                                <p>用手机随时随地轻松管理网络</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='category'>
                            <div className='image' style={{backgroundImage:"url(" + require("~/assets/images/grouping.png") + ")"}}>
                            </div> 
                            <div className='summary'>
                                <h2>分组管理</h2>
                                <p>添加自定义店铺，分组管理设备</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul>
                    <li>
                    <div className='category'>
                        <div className='image' style={{backgroundImage:"url(" + require("~/assets/images/terminal.png") + ")"}}>
                        </div>
                        <div className='summary'>
                            <h2>终端管理</h2>
                            <p>轻松管理联网终端，支持一键优先/禁止上网</p>
                        </div>
                    </div>
                    </li>
                    <li>
                        <div className='category'>
                            <div className='image' style={{backgroundImage:"url(" + require("~/assets/images/route.png") + ")"}}>
                            </div>
                            <div className='summary'>
                                <h2>路由设置</h2>
                                <p>支持多功能设置，全面管理路由器</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>);
    }    
}

