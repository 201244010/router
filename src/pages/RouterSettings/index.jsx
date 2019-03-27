import React from 'react';
import SubLayout from '~/components/SubLayout';

import {Switch, Route, Redirect, NavLink} from "react-router-dom";
import CustomIcon from '../../components/Icon';
import { get } from '~/assets/common/cookie';

import Wechat from '../Advance/Wechat';
import Blacklist from '../Advance/Blacklist';
import Bootdevice from '../Advance/Bootdevice';
import Bandwidth from '../Advance/Bandwidth';
import Systemsetup from '../Advance/Systemsetup';

import Wifi from '../Settings/WI-Fi';
import Lan from '../Settings/Lan';
import Network from '../Settings/Network';

import './index.scss';

const MODULE = 'advance';
export default class RouterSetting extends React.PureComponent {
    constructor(props){
        super(props);

        this.appList = [
            {route: 'bandwidth', color: 'blue', type: 'networkspeeddistribution', content: intl.get(MODULE, 0)/*_i18n:网速智能分配*/},
            {route: 'whitelist', color: 'green', type: 'bootdevice', content: intl.get(MODULE, 2)/*_i18n:优先设备*/},
            {route: 'blacklist', color: 'lightblue', type: 'blacklis', content: intl.get(MODULE, 3)/*_i18n:防蹭网*/},
            // {route: 'systemsetup', type: 'systemsetup', content: intl.get(MODULE, 4)/*_i18n:系统设置*/}
        ];

        this.netList = [
            {route: 'wifi', type: 'wifiset', content: 'Wi-Fi设置' /*_i18n:网速智能分配*/},
            {route: 'network', type: 'browser', content: '上网设置'/*_i18n:网速智能分配*/},
            {route: 'lan', type: 'lanset', content: '局域网设置'/*_i18n:网速智能分配*/},
            // {route: 're', type: 'networkspeeddistribution', content: intl.get(MODULE, 0)/*_i18n:网速智能分配*/},
        ];

        this.systemList = [
            {route: 'bandwidth', type: 'networkspeeddistribution', content: intl.get(MODULE, 0)/*_i18n:网速智能分配*/},
            {route: 'whitelist', type: 'bootdevice', content: intl.get(MODULE, 2)/*_i18n:优先设备*/},
            {route: 'blacklist', type: 'blacklis', content: intl.get(MODULE, 3)/*_i18n:防蹭网*/},  
        ];

        if (window.sessionStorage.getItem('_WECHAT') === 'IS_WECHAT') {
            this.appList.splice(1, 0, {route: 'wechat', type: 'auth', content: intl.get(MODULE, 1)/*_i18n:微信连Wi-Fi*/})
        }

        this.liList = [
            this.appList,
            this.netList,
            this.systemList
        ];

    }

    goPage = (route) => {
        this.props.history.push(route)
    }

    render(){
        const {match} = this.props;
        const listItems = (list, title) => {
            return (
                <li>
                    <p>{title}</p>
                    <div className="nav-contain">
                        {
                            list.length > 0 && list.map(item =>{
                                return (
                                    // <NavLink to={match.path + "/" + item.route} activeClassName="active">
                                            <div onClick={() => this.goPage(item.route)} className="nav-item">
                                                <div className="icon">
                                                    <CustomIcon type={item.type} style={{color: item.color}} size={68}/>
                                                </div>
                                                <p>{item.content}</p>
                                            </div>
                                    // </NavLink>
                                )
                            })
                        }
                </div>
                </li> 
            )}
        
        return (
            <SubLayout className="advance-settings">
                <ul>
                    {listItems(this.appList, '网络设置')}
                    {listItems(this.netList, '应用工具')}
                    {listItems(this.systemList, '系统工具')}
                </ul> 
                <article>
                    <Switch>
                        <Route path={`/advance/bandwidth`} component={Bandwidth} />
                        <Route path={`/whitelist`} component={Bootdevice} />
                        <Route path={`/blacklist`} component={Blacklist} />
                        <Route path={`/wechat`} component={Wechat} />
                        <Route path={`/systemsetup`} component={Systemsetup} />
                        {/* <Redirect from={match.path} to={`${match.path}/bandwidth`}></Redirect> */}
                    </Switch>
                </article>
            </SubLayout>
        );
    }
};

