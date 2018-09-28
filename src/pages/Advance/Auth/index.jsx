
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
            <Tabs className="weixin-tabs" defaultActiveKey="WeChatAuth">
                <TabPane tab="微信认证" key="WeChatAuth"><WeChatAuth /></TabPane>
                <TabPane tab="短信认证" key="SmsAuth"><SmsAuth /></TabPane>
                <TabPane tab="免认证策略" key="NonAuth"><NonAuth /></TabPane>
                <TabPane tab="认证用户列表" key="AuthUserList"><AuthUserList /></TabPane>
            </Tabs>
        );
    }
};

