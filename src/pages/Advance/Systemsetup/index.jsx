import React from 'react';
import {Tabs} from 'antd';
import Dosd from './Dosd';
import ChangePassword from './ChangePassword';
import SysUpgrade from './SysUpgrade';
import Backup from './Backup';
import TimeZone from './TimeZone';
import Reboot from './Reboot';
import Recovery from './Recovery';

import './system.scss'

const MODULE = 'systemsetup';
const TabPane = Tabs.TabPane;

export default class Systemsetup extends React.PureComponent {
    getVersion = () => {
        let QUICK_SETUP = JSON.parse(window.sessionStorage.getItem('QUICK_SETUP'));     //获取版本信息

        if (3 === QUICK_SETUP.length) {             //根据快速设置的步骤数，判断是国内版还是海外版
            return "domestic";
        }

        if (4 === QUICK_SETUP.length) {
            return "abroad";
        }
    }

    render(){
        if ('domestic' === this.getVersion()) {
            return (
                <Tabs>
                    <TabPane tab={intl.get(MODULE, 0)/*_i18n:安全设置*/} key="1"><Dosd /></TabPane>
                    <TabPane tab={intl.get(MODULE, 1)/*_i18n:修改管理密码*/} key="2"><ChangePassword /></TabPane>
                    <TabPane tab={intl.get(MODULE, 2)/*_i18n:系统升级*/} key="3"><SysUpgrade /></TabPane>
                    <TabPane tab={intl.get(MODULE, 3)/*_i18n:备份与恢复*/} key="4"><Backup /></TabPane>
                    <TabPane tab={intl.get(MODULE, 4)/*_i18n:重启路由器*/} key="6"><Reboot /></TabPane>
                    <TabPane tab={intl.get(MODULE, 5)/*_i18n:恢复出厂设置*/} key="7"><Recovery /></TabPane>
                </Tabs>
            );
        }

        if ('abroad' === this.getVersion()) {
            return (
                <Tabs>
                    <TabPane tab={intl.get(MODULE, 0)/*_i18n:安全设置*/} key="1"><Dosd /></TabPane>
                    <TabPane tab={intl.get(MODULE, 1)/*_i18n:修改管理密码*/} key="2"><ChangePassword /></TabPane>
                    <TabPane tab={intl.get(MODULE, 2)/*_i18n:系统升级*/} key="3"><SysUpgrade /></TabPane>
                    <TabPane tab={intl.get(MODULE, 3)/*_i18n:备份与恢复*/} key="4"><Backup /></TabPane>
                    <TabPane tab={intl.get(MODULE, 6)/*_i18n:时区/时间*/} key="5"><TimeZone /></TabPane>
                    <TabPane tab={intl.get(MODULE, 4)/*_i18n:重启路由器*/} key="6"><Reboot /></TabPane>
                    <TabPane tab={intl.get(MODULE, 5)/*_i18n:恢复出厂设置*/} key="7"><Recovery /></TabPane>
                </Tabs>
            );
        } 
        
    }
};

