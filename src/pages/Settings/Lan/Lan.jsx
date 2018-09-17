
import React from 'react';
import {Tabs} from 'antd';
import LanSet from './LanSet';
import StaticBind from './StaticBind';

const TabPane = Tabs.TabPane;

export default class Lan extends React.Component {
    render(){
        return (
            <Tabs className="lan-set-tab" defaultActiveKey="staticBind">
                <TabPane tab="局域网设置" key="lanSet"><LanSet /></TabPane>
                <TabPane tab="静态地址分配" key="staticBind"><StaticBind /></TabPane>
            </Tabs>
        );
    }
};







