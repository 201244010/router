import React from 'react';
import SubLayout from '~/components/SubLayout';
import CustomIcon from '../../components/Icon';
import {getQuickStartVersion} from '~/utils';

import './index.scss';

const MODULE = 'routersettings';
export default class RouterSetting extends React.PureComponent {
    constructor(props){
        super(props);

        this.netList = [
            {route: 'wifiset', type: 'WiFi', color: '#6D6BD8', content: intl.get(MODULE, 0)/*_i18n:Wi-Fi设置*/ },
            {route: 'network', type: 'Internet',color: '#47D164', content: intl.get(MODULE, 1)/*_i18n:上网设置*/},
            {route: 'lan', type: 'lan',color: '#448BE9', content: intl.get(MODULE, 2)/*_i18n:局域网设置*/},
            {route: 'routermanage', type: 'childroute', color: '#3CA8E7', content: intl.get(MODULE, 3)/*_i18n:子路由设置*/},
            {route: 'mobileNetwork', type: 'childroute', color: '#3CA8E7', content: intl.get(MODULE, 23)/*_i18n:子路由设置*/},
        ];

        this.appList = [
            {route: 'bandwidth', color: '#6D6BD8', type: 'Bandwidth', content: intl.get(MODULE, 14)/*_i18n:网速智能分配*/},
            {route: 'blacklist', color: '#E96044', type: 'blacklist', content: intl.get(MODULE, 17)/*_i18n:防蹭网*/},
            {route: 'bootdevice', color: '#448BE9', type: 'Bootdevice', content: intl.get(MODULE, 16)/*_i18n:优先设备*/}, 
            {route: 'dosd', type: 'protect',color: '#47D164', content: intl.get(MODULE, 4)/*_i18n:攻击防护*/},
            // {route: 'customupgrade', type: 'upgradetime', color: '#6174F1', content: intl.get(MODULE, 21)/*_i18n:自定义固件升级*/},
            // {route: 'customrestart', type: 'restart',color: '#47D164', content: intl.get(MODULE, 22)/*_i18n:攻击防护*/},
            {route: 'portforwarding', type: 'portforwarding', color: '#6D6BD8', content: intl.get(MODULE, 20)/*_i18n:端口转发*/},
            {route: 'upnp', type: 'upnp', color: '#3CA8E7', content: intl.get(MODULE, 19)/*_i18n:UPnP设置*/},
            // {route: 'systemsetup', type: 'systemsetup', content: intl.get(MODULE, 4)/*_i18n:攻击防护*/}
        ];

        this.systemList = [
            {route: 'changepassword', type: 'changepassword', color: '#E96044', content: intl.get(MODULE, 5)/*_i18n:修改管理密码*/},
            {route: 'backup', type: 'backup', color: '#6D6BD8', content: intl.get(MODULE, 6)/*_i18n:备份与恢复*/},  
            {route: 'upgrade', type: 'upgrade', color: '#47D164', content: intl.get(MODULE, 7)/*_i18n:系统升级*/},  
            {route: 'recovery', type: 'factoryreset', color: '#E96044', content: intl.get(MODULE, 8)/*_i18n:恢复出厂设置*/},  
            {route: 'reboot', type: 'reboot', color: '#E96044', content: intl.get(MODULE, 9)/*_i18n:重启路由器*/},
            {route: 'localUpgrade', type: 'reboot', color: '#E96044', content: intl.get(MODULE, 24)/*_i18n:本地升级*/}, 
        ];

		if (getQuickStartVersion() === 'abroad') {
			this.systemList.splice(5, 0, {route: 'timeset', type: 'timezone', color: '#6D6BD8', content: intl.get(MODULE, 10)/*_i18n:时间设置*/})
		}

        if (window.sessionStorage.getItem('_WECHAT') === 'IS_WECHAT') {
            this.appList.splice(1, 0, {route: 'wechat', type: 'wechat',color: '#47D164', content: intl.get(MODULE, 15)/*_i18n:微信连Wi-Fi*/})
        }
    }

    goPage = (route) => {
        this.props.history.push('/routersetting/' + route)
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
            <SubLayout className="advance-settings" style={{height: window.innerHeight - 148, marginTop: 8}}>
                <ul>
                    {listItems(this.netList, intl.get(MODULE, 11)/*_i18n:网络设置*/)}
                    {listItems(this.appList, intl.get(MODULE, 12)/*_i18n:应用工具*/)}
                    {listItems(this.systemList, intl.get(MODULE, 13)/*_i18n:系统工具*/)}
                </ul>
            </SubLayout>
        );
    }
};

