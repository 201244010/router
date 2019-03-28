
import React from 'react';
import {Tabs} from 'antd';
import LanSet from './LanSet';
import StaticBind from './StaticBind';
import SubLayout from '~/components/SubLayout';

import './lan.scss';

const MODULE = 'lan';

const TabPane = Tabs.TabPane;

export default class Lan extends React.Component {
    render(){
        return (
            <SubLayout className="net-setting">
                <Tabs className="lan-set-tab">
                    <TabPane tab={intl.get(MODULE, 0)/*_i18n:局域网设置*/} key="1"><LanSet /></TabPane>
                    <TabPane tab={intl.get(MODULE, 1)/*_i18n:静态地址分配*/} key="2"><StaticBind /></TabPane>
                </Tabs>
            </SubLayout>
        );
    }
};







