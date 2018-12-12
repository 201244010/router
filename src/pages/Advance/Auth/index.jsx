
import React from 'react';
import {Tabs} from 'antd';
import WeChatAuth from './WeChatAuth';
import SmsAuth from './SmsAuth';
import NonAuth from './NonAuth';
import AuthUserList from './AuthUserList';

import './auth.scss'

const TabPane = Tabs.TabPane;

export default class Auth extends React.PureComponent {
    render(){
        return (
            <Tabs className="weixin-tabs">
                <TabPane tab="微信认证" key="1"><WeChatAuth /></TabPane>
                <TabPane tab="短信认证" key="2"><SmsAuth /></TabPane>
                <TabPane tab="免认证策略" key="3"><NonAuth /></TabPane>
                <TabPane tab="认证用户列表" key="4"><AuthUserList /></TabPane>
            </Tabs>
        );
    }
};

