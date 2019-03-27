import React from 'react';
import SubLayout from '~/components/SubLayout';

import {Switch, Route, Redirect, NavLink} from "react-router-dom";
import CustomIcon from '../../components/Icon';
import { get } from '~/assets/common/cookie';

import './index.scss';
import Wechat from './Wechat';
import Blacklist from './Blacklist';
import Bootdevice from './Bootdevice';
import Bandwidth from './Bandwidth';
import Systemsetup from './Systemsetup';


const MODULE = 'advance';
export default class Advance extends React.PureComponent {
    constructor(props){
        super(props);
        this.navList = [
            {route: 'bandwidth', type: 'networkspeeddistribution', content: intl.get(MODULE, 0)/*_i18n:网速智能分配*/},
            {route: 'whitelist', type: 'bootdevice', content: intl.get(MODULE, 2)/*_i18n:优先设备*/},
            {route: 'blacklist', type: 'blacklis', content: intl.get(MODULE, 3)/*_i18n:防蹭网*/},
            {route: 'systemsetup', type: 'systemsetup', content: intl.get(MODULE, 4)/*_i18n:系统设置*/}
        ];
        if (window.sessionStorage.getItem('_WECHAT') === 'IS_WECHAT') {
            this.navList.splice(1, 0, {route: 'wechat', type: 'auth', content: intl.get(MODULE, 1)/*_i18n:微信连Wi-Fi*/})
        }
    }

    render(){
        const {match} = this.props;
        return (
            <SubLayout className="advance-settings">
                    {
                        this.navList.length > 0 && this.navList.map(item =>{
                            return (
                                <NavLink to={match.path + "/" + item.route} activeClassName="active">
                                    <div className="nav-item">
                                        <CustomIcon type={item.type} size={28}/>
                                        <span>{item.content}</span>
                                    </div>
                                </NavLink>
                            )
                        })
                    }
                <article>
                    <Switch>
                        <Route path={`${match.path}/bandwidth`} component={Bandwidth} />
                        <Route path={`${match.path}/whitelist`} component={Bootdevice} />
                        <Route path={`${match.path}/blacklist`} component={Blacklist} />
                        <Route path={`${match.path}/wechat`} component={Wechat} />
                        <Route path={`${match.path}/systemsetup`} component={Systemsetup} />
                        {/* <Redirect from={match.path} to={`${match.path}/bandwidth`}></Redirect> */}
                    </Switch>
                </article>
            </SubLayout>
        );
    }
};

