import React from 'react';
import SubLayout from '~/components/SubLayout';

import {Switch, Route, Redirect, NavLink} from "react-router-dom";
import CustomIcon from '../../components/Icon';

import '../Settings/settings.scss'

import Authentication from './Authentication';
import Cengnet from './Cengnet';
import Equipmet from './Equipment';
import NetworkSpeed from './NetworkSpeed';
import Systemset from './Systemset';

export default class Advance extends React.PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        const {match} = this.props;
        return (
            <SubLayout className="settings">
                <nav>
                    <NavLink to={match.path + "/networkSpeed"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="wifiset" size={28}/>
                            <span>网速智能分配</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/equipment"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="wifiset" size={28}/>
                            <span>优先设备</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/cengnet"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="wifiset" size={28}/>
                            <span>防蹭网</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/authentication"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="wifiset" size={28}/>
                            <span>认证管理</span>
                        </div>
                    </NavLink>
                    <NavLink to={match.path + "/systemset"} activeClassName="active">
                        <div className="nav-item">
                            <CustomIcon type="wifiset" size={28}/>
                            <span>系统设置</span>
                        </div>
                    </NavLink>
                </nav>
                <article>
                    <Switch>
                        <Route path={`${match.path}/networkSpeed`} component={NetworkSpeed} />
                        <Route path={`${match.path}/equipment`} component={Equipmet} />
                        <Route path={`${match.path}/cengnet`} component={Cengnet} />
                        <Route path={`${match.path}/authentication`} component={Authentication} />
                        <Route path={`${match.path}/systemset`} component={Systemset} />
                        <Redirect from={match.path} to={`${match.path}/networkSpeed`}></Redirect>
                    </Switch>
                </article>
            </SubLayout>
        );
    }
};

