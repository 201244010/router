import React from 'react';
import {Tabs} from 'antd';
import Dosd from './Dosd';
import ChangePassword from './ChangePassword';
import SysUpgrade from './SysUpgrade';
import Backup from './Backup';
import TimeZone from './TimeZone';
import Reboot from './Reboot';
import Recovery from './Recovery';
import intl from '~/i18n/intl';

import './system.scss'

const MODULE = 'systemsetup';
const TabPane = Tabs.TabPane;

export default class Systemsetup extends React.PureComponent {
    render(){
        return (
            <Tabs>
                <TabPane tab={intl.get(MODULE, 0)} key="1"><Dosd /></TabPane>
                <TabPane tab={intl.get(MODULE, 1)} key="2"><ChangePassword /></TabPane>
                <TabPane tab={intl.get(MODULE, 2)} key="3"><SysUpgrade /></TabPane>
                <TabPane tab={intl.get(MODULE, 3)} key="4"><Backup /></TabPane>
                <TabPane tab={intl.get(MODULE, 6)} key="5"><TimeZone /></TabPane>
                <TabPane tab={intl.get(MODULE, 4)} key="6"><Reboot /></TabPane>
                <TabPane tab={intl.get(MODULE, 5)} key="7"><Recovery /></TabPane>
            </Tabs>
        );
    }
};

