import React from 'react';
import {Tabs} from 'antd';
import Dosd from './Dosd';
import ChangePassword from './ChangePassword';
import SysUpgrade from './SysUpgrade';
import Backup from './Backup';
import TimeZone from './TimeZone';
import Reboot from './Reboot';
import Recovery from './Recovery';
import {getQuickStartVersion} from '~/utils';

import './system.scss'

const MODULE = 'systemsetup';
const TabPane = Tabs.TabPane;

export default class Systemsetup extends React.PureComponent {
    render() {
        const quickStartVersion = getQuickStartVersion();

        if ('domestic' === quickStartVersion) {
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
        } else if ('abroad' === quickStartVersion) {
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
        } else {
            return <noscript/>
        }
    }
};

