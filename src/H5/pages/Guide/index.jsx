
import React from 'react';
import classnames from 'classnames';
import { Switch, Route, Redirect } from "react-router-dom";
import SetPwd from './SetPwd';
import SetWan from './SetWan';
import PPPoE from './SetWan/PPPoE';
import Static from './SetWan/Static';
import SetWifi from './SetWifi';
import Guest from './Guest';
import Finish from './Finish';
import Icon from '~/components/Icon';

import './guide.scss';

export default class Guide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            icon: 'lock'
        };
    }

    static getDerivedStateFromProps(nextProps){
        let { match } = nextProps, path = match.path, pathname = location.pathname;
        let route = pathname.replace(path + '/', '').replace(/\/.*/gi, '');
        console.log(route);
        const iconMap = {
            setpwd: 'lock',
            setwan: 'browser',
            detect: 'browser',
            pppoe: 'browser',
            static: 'browser',
            setwifi: 'wifi',
            guest: 'wifi',
            finish: 'succeed',
        };
        return {
            icon: iconMap[route]
        };
    }   

    render(){
        const { match } = this.props, icon = this.state.icon;
        return (
            <div className='guide-container'>
                <div className="header">
                    <Icon type='logo' size={'1.3333rem'} color="#fff" />
                    <div className='step-icon'><Icon type={icon} size={'4rem'} color="#4F75E7" /></div>
                </div>
                <div className="guide-body">
                    <Switch>
                        <Route path={`${match.path}/setpwd`} component={SetPwd} />
                        <Route path={`${match.path}/setwan/:type`} component={SetWan} />
                        <Route path={`${match.path}/pppoe`} component={PPPoE} />
                        <Route path={`${match.path}/static`} component={Static} />
                        <Route path={`${match.path}/setwifi`} component={SetWifi} />

                        {/**
                         * 商户WiFi设置界面不保存配置（保存的话会导致手机WiFi断开），传递到顾客WiFi界面在保存
                         * 通过 '/:wifi' 将商户WiFi设置界面数据传递到顾客WiFi界面
                         */}
                        <Route path={`${match.path}/guest/:wifi`} component={Guest} />

                        {/**
                         * 如果配置丢失（一般情况是用户将url中的参数删除），重定向到商户WiFi设置界面
                         */}
                        <Redirect from={`${match.path}/guest`} to={`${match.path}/setwifi`}></Redirect>

                        {/**
                         * 通过 '/:wifi' 将商户WiFi、顾客WiFi配置数据传递到完成界面
                         */}
                        <Route path={`${match.path}/finish/:wifi`} component={Finish} />

                        {/**
                         * 如果配置丢失（一般情况是用户将url中的参数删除），重定向到商户WiFi设置界面
                         */}
                        <Redirect from={`${match.path}/finish`} to={`${match.path}/setwifi`}></Redirect>

                        {/**
                         * 默认重定向到设置管理员密码页面
                         */}
                        <Redirect from={match.path} to={`${match.path}/setpwd`}></Redirect>
                    </Switch>
                </div>
            </div>
        );
    }

}
