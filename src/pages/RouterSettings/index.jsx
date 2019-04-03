import React from 'react';
import SubLayout from '~/components/SubLayout';

import {Switch, Route, Redirect, NavLink} from "react-router-dom";
import CustomIcon from '../../components/Icon';

import './index.scss';

const MODULE = 'advance';
export default class RouterSetting extends React.PureComponent {
    constructor(props){
        super(props);

        this.netList = [
            {route: 'wifi', type: 'WiFi', color: '#6D6BD8', content: 'Wi-Fi设置' /*_i18n:网速智能分配*/},
            {route: 'network', type: 'Internet',color: '#47D164', content: '上网设置'/*_i18n:网速智能分配*/},
            {route: 'lan', type: 'lan',color: '#448BE9', content: '局域网设置'/*_i18n:网速智能分配*/},
            {route: 'lan', type: 'childroute', color: '#3CA8E7', content: '子路由设置'/*_i18n:网速智能分配*/},
        ];

        this.appList = [
            // {route: 'wechat', type: 'wechat',color: '#47D164', content: intl.get(MODULE, 1)},
            {route: 'bandwidth', color: '#6D6BD8', type: 'Bandwidth', content: intl.get(MODULE, 0)/*_i18n:网速智能分配*/},
            {route: 'bootdevice', color: '#47D164', type: 'Bootdevice', content: intl.get(MODULE, 2)/*_i18n:优先设备*/},
            {route: 'blacklist', color: '#448BE9', type: 'blacklist', content: intl.get(MODULE, 3)/*_i18n:防蹭网*/},
            {route: 'dosd', type: 'protect',color: '#47D164', content: '攻击防护'/*_i18n:网速智能分配*/},
            // {route: 'systemsetup', type: 'systemsetup', content: intl.get(MODULE, 4)/*_i18n:系统设置*/}
        ];

        this.systemList = [
            {route: 'changepassword', type: 'changepassword', color: '#E96044', content: '修改管理密码'/*_i18n:优先设备*/},
            {route: 'backup', type: 'backup', color: '#6D6BD8', content: '备份与恢复'/*_i18n:防蹭网*/},  
            {route: 'upgrade', type: 'upgrade', color: '#47D164', content: '系统升级'/*_i18n:防蹭网*/},  
            {route: 'recovery', type: 'factoryreset', color: '#E96044', content: '恢复出厂设置'/*_i18n:防蹭网*/},  
            {route: 'timeset', type: 'timezone', color: '#6D6BD8', content: '时间设置'/*_i18n:防蹭网*/},  
            {route: 'reboot', type: 'reboot', color: '#E96044', content: '重启路由器'/*_i18n:防蹭网*/},  
        ];

        if (window.sessionStorage.getItem('_WECHAT') === 'IS_WECHAT') {
            this.appList.splice(1, 0, {route: 'wechat', type: 'wechat',color: '#47D164', content: intl.get(MODULE, 1)/*_i18n:微信连Wi-Fi*/})
        }
    }

    goPage = (route) => {
        this.props.history.push('/' + route)
    }

    render(){
        const listItems = (list, title) => {
            return (
                <li>
                    <p>{title}</p>
                    <div key={title} className="nav-contain">
                        {
                            list.length > 0 && list.map(item =>{
                                return (
                                    <div onClick={() => this.goPage(item.route)} className="nav-item">
                                        <div className="icon">
                                            <CustomIcon type={item.type} style={{color: item.color}} size={68}/>
                                        </div>
                                        <p>{item.content}</p>
                                    </div>
                                )
                            })
                        }
                </div>
                </li> 
            )}
        
        return (
            <SubLayout className="advance-settings" style={{maxHeight: window.innerHeight - 144, marginTop: 11}}>
                <ul>
                    {listItems(this.netList, '网络设置')}
                    {listItems(this.appList, '应用工具')}
                    {listItems(this.systemList, '系统工具')}
                </ul>
            </SubLayout>
        );
    }
};

