
import React from 'react';
import {Tabs} from 'antd';
import LanSet from './LanSet';
import StaticBind from './StaticBind';

import './lan.scss';

const MODULE = 'lan';

const TabPane = Tabs.TabPane;

export default class Lan extends React.Component {
    render(){
        return (
            <Tabs className="lan-set-tab">
                <TabPane tab={intl.get(MODULE, 0)} key="1"><LanSet /></TabPane>
                <TabPane tab={intl.get(MODULE, 1)} key="2"><StaticBind /></TabPane>
            </Tabs>
        );
    }
};







