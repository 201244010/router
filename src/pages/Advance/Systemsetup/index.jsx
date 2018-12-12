import React from 'react';
import {Tabs} from 'antd';
import Dosd from './Dosd';
import ChangePassword from './ChangePassword';
import SysUpgrade from './SysUpgrade';
import Backup from './Backup';
//import TimeZone from './TimeZone';
import Reboot from './Reboot';
import Recovery from './Recovery';

import './system.scss'

const TabPane = Tabs.TabPane;

export default class Systemsetup extends React.PureComponent {
    render(){
        return (
            <Tabs>
                <TabPane tab="攻击防护" key="1"><Dosd /></TabPane>
                <TabPane tab="修改管理密码" key="2"><ChangePassword /></TabPane>
                <TabPane tab="系统升级" key="3"><SysUpgrade /></TabPane>
                <TabPane tab="备份与恢复" key="4"><Backup /></TabPane>
                {/* <TabPane tab="时区/时间" key="5"><TimeZone /></TabPane> */}
                <TabPane tab="重启路由器" key="6"><Reboot /></TabPane>
                <TabPane tab="恢复出厂设置" key="7"><Recovery /></TabPane>
            </Tabs>
        );
    }
};

