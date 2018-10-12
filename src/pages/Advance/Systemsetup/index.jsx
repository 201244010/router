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

const TabPane = Tabs.TabPane;

export default class Systemsetup extends React.PureComponent {
    render(){
        return (
            <Tabs>
                <TabPane tab="攻击防护" key="Dosd"><Dosd /></TabPane>
                <TabPane tab="修改管理员密码" key="ChangePassword"><ChangePassword /></TabPane>
                <TabPane tab="系统升级" key="SysUpgrade"><SysUpgrade /></TabPane>
                <TabPane tab="备份与恢复" key="Backup"><Backup /></TabPane>
                <TabPane tab="时区/时间" key="TimeZone"><TimeZone /></TabPane>
                <TabPane tab="重启路由器" key="Reboot"><Reboot /></TabPane>
                <TabPane tab="恢复出厂设置" key="Recovery"><Recovery /></TabPane>
            </Tabs>
        );
    }
};

