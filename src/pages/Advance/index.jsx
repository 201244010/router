import React from 'react';
import SubLayout from '~/components/SubLayout';

import {Switch, Route, Redirect, NavLink} from "react-router-dom";
import CustomIcon from '../../components/Icon';

import '../Settings/settings.scss'

import Auth from './Auth';
import Blacklist from './Blacklist';
import Bootdevice from './Bootdevice';
import Bandwidth from './Bandwidth';
import Systemsetup from './Systemsetup';

export default class Advance extends React.PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        const {match} = this.props;
        return (
            <SubLayout className="settings">
                <nav>
                    <NavLink to={match.path + "/bandwidth"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="networkspeeddistribution" size={28}/>
                            <span>网速智能分配</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/whitelist"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="bootdevice" size={28}/>
                            <span>优先设备</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/blacklist"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="blacklis" size={28}/>
                            <span>防蹭网</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/auth"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="auth" size={28}/>
                            <span>认证管理</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/systemsetup"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="systemsetup" size={28}/>
                            <span>系统设置</span>
                        </div>
                    </NavLink>
                </nav>
                <article>
                    <Switch>
                        <Route path={`${match.path}/bandwidth`} component={Bandwidth} />
                        <Route path={`${match.path}/whitelist`} component={Bootdevice} />
                        <Route path={`${match.path}/blacklist`} component={Blacklist} />
                        <Route path={`${match.path}/auth`} component={Auth} />
                        <Route path={`${match.path}/systemsetup`} component={Systemsetup} />
                        <Redirect from={match.path} to={`${match.path}/bandwidth`}></Redirect>
                    </Switch>
                </article>
            </SubLayout>
        );
    }
};

