
import React from 'react';
import SubLayout from '~/components/SubLayout';
import CustomIcon from '~/components/Icon';
import { Switch, Route, Redirect } from "react-router-dom";

import Wifi from './WI-Fi';

import './settings.scss';


export default class Setting extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const {match} = this.props;
        return (
            <SubLayout className="settings">
                <nav>
                    <div className="now nav-item">
                        <CustomIcon type="wifiset" size={28} />
                        <span>WI-FI设置</span>
                    </div>
                    <div className="nav-item">
                        <CustomIcon type="browser"  size={28} />
                        <span>上网设置</span>
                    </div>
                    <div className="nav-item">
                        <CustomIcon type="lanset"  size={28} />
                        <span>局域网设置</span>
                    </div>
                </nav>
                <article>
                    <Switch>
                        <Route path={`${match.path}/wifi`} component={Wifi} />
                        <Redirect from={match.path} to={`${match.path}/wifi`}></Redirect>
                    </Switch>
                </article>
            </SubLayout>
        )
    }
};







