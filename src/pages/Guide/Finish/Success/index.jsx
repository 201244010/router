import React from 'react';
import {Button} from 'antd';
import {NavLink} from "react-router-dom";
import CustomIcon from '~/components/Icon';

import './success.scss';

export default class Success extends React.Component {
    constructor(props) {
        super(props);
    }

    goHome = () => {
        this.props.history.push('/home');
    }

    render() {
        return (
            <div className='user-experience'>
                <div className='head'>
                    <h4>我们为您准备以下功能，开始体验吧</h4>
                    <Button onClick={this.goHome} className='go-home'>去首页</Button>
                </div>
                <div className='body'>
                    <ul>
                        <li>
                            <NavLink to={'/advance/bandwidth'}>
                                <div className='img'>
                                    <CustomIcon style={{margin: 13}} size={54} color='#92ABF6' type="networkspeeddistribution" />
                                </div>
                                <div className='description'>
                                    <h4>网速智能分配</h4>
                                    <p>优先保障商家设备网速</p>
                                </div>
                                <div className='background'>
                                    <CustomIcon size={103} color='#92ABF6' type="bg_speed" />
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/advance/wechat'}>
                                <div className='img'>
                                    <CustomIcon style={{margin: 13}} size={54} color='#99DD8B' type="auth" />
                                </div>
                                <div className='description'>
                                    <h4>微信连Wi-Fi</h4>
                                    <p>为您轻松吸粉精准营销</p>
                                </div>
                                <div className='background'>
                                    <CustomIcon size={103} color='#99DD8B' type="bg_wechat" />
                                </div>
                            </NavLink>
                        </li>    
                    </ul>
                    <ul>
                        <li>
                            <NavLink to={'/home'}>
                                <div className='img'>
                                    <CustomIcon style={{margin: 7}} size={66} color='#F79D5C' type="search" />
                                </div>
                                <div className='description'>
                                    <h4>搜寻附近商米设备</h4>
                                    <p>商米设备一键入网</p>
                                </div>
                                <div className='background'>
                                    <CustomIcon size={103} color='#F79D5C' type="bg_search" />
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/home'}>
                                <div className='img'>
                                    <CustomIcon style={{margin: 13}} size={54} color='#F9AFDD' type="blacklis" />
                                </div>
                                <div className='description'>
                                    <h4>联网设备管理</h4>
                                    <p>轻松设置上网权限</p>
                                </div>
                                <div className='background'>
                                    <CustomIcon size={103} color='#F9AFDD' type="bg_equipment" />
                                </div>
                            </NavLink>
                        </li>  
                    </ul>
                </div>
            </div>
        );
    }
}