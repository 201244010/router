import React from 'react';
import {Button} from 'antd';
import CustomIcon from '~/components/Icon';

import './userExperience.scss';

export default class UserExperience extends React.Component {
    constructor(props) {
        super(props);
    }

    home = () => {
        this.props.history.push('/home');
    }

    setSpeed = () => {
        this.props.history.push('/advance/bandwidth');
    }

    wechat = () => {
        this.props.history.push('/advance/wechat');
    }

    search = () => {
        this.props.history.push('/home');
    }

    management = () => {
        this.props.history.push('/home');
    }

    render() {
        return (
            <div className='user-experience'>
                <div className= 'head'>
                    <h3>我们为您准备以下功能，开始体验吧</h3>
                    <Button onClick={this.home} className='button'>去首页</Button>
                </div>
                <div className='body'>
                    <ul>
                        <li onClick={this.setSpeed}>
                            <div className='img'>
                                <CustomIcon style={{margin: 13}} size={54} color='#92ABF6' type="networkspeeddistribution"></CustomIcon>
                            </div>
                            <div className='discription'>
                                <h4>网速智能分配</h4>
                                <p>优先保障商家设备网速</p>
                            </div>
                        </li>
                        <li onClick={this.wechat}>
                            <div className='img'>
                                <CustomIcon style={{margin: 13}} size={54} color='#99DD8B' type="auth"></CustomIcon>
                            </div>
                            <div className='discription'>
                                <h4>微信连Wi-Fi</h4>
                                <p>为您轻松吸粉精准营销</p>
                            </div>
                        </li>
                    </ul>
                    <ul>
                        <li onClick={this.search}>
                            <div className='img'>
                                <CustomIcon style={{margin: 7}} size={66} color='#F79D5C' type="search"></CustomIcon>
                            </div>
                            <div className='discription'>
                                <h4>搜寻附近商米设备</h4>
                                <p>商米设备一键入网</p>
                            </div>
                        </li>
                        <li onClick={this.management}>
                            <div className='img'>
                                <CustomIcon style={{margin: 13}} size={54} color='#F9AFDD' type="blacklis"></CustomIcon>
                            </div>
                            <div className='discription'>
                                <h4>联网设备管理</h4>
                                <p>轻松设置上网权限</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}