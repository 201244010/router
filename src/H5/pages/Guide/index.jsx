
import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import SetPwd from './SetPwd';
import SetWan from './SetWan';
import PPPoE from './SetWan/PPPoE';
import Static from './SetWan/Static';
import SetWifi from './SetWifi';
import Finish from './Finish';
import AddSubRouter from './AddSubRouter';

import './guide.scss';

export default class Guide extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const { match } = this.props;
        return (
            <div className='guide-container'>
                <div className="guide-body">
                    <Switch>
                        <Route path={`${match.path}/setpwd`} component={SetPwd} />
                        <Route path={`${match.path}/setwan/:type`} component={SetWan} />
                        <Route path={`${match.path}/pppoe`} component={PPPoE} />
                        <Route path={`${match.path}/static`} component={Static} />
                        <Route path={`${match.path}/setwifi`} component={SetWifi} />
                        <Route path={`${match.path}/addsubrouter`} component={AddSubRouter} />

                        {/**
                         * 通过 '/:wifi' 将商户WiFi、客用WiFi配置数据传递到完成界面
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
