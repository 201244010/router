
import React from 'react';
import SubLayout from '~/components/SubLayout';
import CustomIcon from '~/components/Icon';
import { Switch, Route, Redirect, NavLink } from "react-router-dom";

import Wifi from './WI-Fi';
import Lan from './Lan';
import Network from './Network';

import './settings.scss';

const MODULE = 'settings';
export default class Setting extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const {match} = this.props;
        return (
            <SubLayout className="settings">
                <nav>
                    <NavLink to={match.path + "/wifi"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="wifiset" size={28} />
                            <span>{intl.get(MODULE, 0)}</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/network"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="browser" size={28} />
                            <span>{intl.get(MODULE, 1)}</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/lan"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="lanset" size={28} />
                            <span>{intl.get(MODULE, 2)}</span>
                        </div>
                    </NavLink>
                </nav>
                <article>
                    <Switch>
                        <Route path={`${match.path}/wifi`} component={Wifi} />
                        <Route path={`${match.path}/lan`} component={Lan} />
                        <Route path={`${match.path}/Network`} component={Network} />
                        <Redirect from={match.path} to={`${match.path}/wifi`}></Redirect>
                    </Switch>
                </article>
            </SubLayout>
        )
    }
};







