
import React from 'react';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SetPassword from './SetPassword';
import SetWan from './SetWan';
import Speed from './Speed';
import SetWifi from './SetWifi';
import SubLayout from '~/components/SubLayout';
import Icon from '~/components/Icon';

import './guide.scss';


const Start = props => {
    return <div>开始设置</div>
};

export default class Guide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeRouteName : '',
            iconType : 'lock'
        };
    }

    dones = {
        setpassword : [],
        setwan : ['setpassword'],
        speed : ['setpassword', 'setwan'],
        setwifi : ['setpassword', 'setwan', 'speed']
    };

    static getDerivedStateFromProps(nextProps){
        let { match } = nextProps, path = match.path, pathname = location.pathname;
        let route = pathname.replace(path + '/', '');
        return {
            activeRouteName : route
        };
    }   

    // 根据路由或得当前菜单的 class list
    initStepMenu(step){
        let activeRouteName = this.state.activeRouteName;
        return classnames({
            now : activeRouteName === step,
            done : this.dones[activeRouteName] && this.dones[activeRouteName].indexOf(step) > -1
        });
    }

    render(){
        const { match } = this.props, activeRouteName = this.state.activeRouteName;
        const iconType = { setpassword : 'lock', setwan : 'browser', speed : 'bandwidth', setwifi : 'wifi' }[activeRouteName];
        return (
            <SubLayout className="steps ui-relative">
                <ul className="guide-header">
                    <li className={this.initStepMenu('setpassword')}>
                        <i className="ui-ib order-num">1</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">设置密码</span>
                    </li>
                    <li className="line"></li>
                    <li className={this.initStepMenu('setwan')}>
                        <i className="ui-ib order-num">2</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">设置上网参数</span>
                    </li>
                    <li className="line"></li>
                    <li className={this.initStepMenu('speed')}>
                        <i className="ui-ib order-num">3</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">设置上下行宽带</span>
                    </li>
                    <li className="line"></li>
                    <li className={this.initStepMenu('setwifi')}>
                        <i className="ui-ib order-num">4</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">设置无线网络</span>
                    </li>
                </ul>
                <div className="icon-bg">
                    <Icon type={iconType || "lock"} size={240} />
                </div>
                <div className="guide-body">
                    <Switch>
                        {/* <Route path={match.path} exact component={Start}></Route> */}
                        <Route path={`${match.path}/setpassword`} component={SetPassword} />
                        <Route path={`${match.path}/setwan`} component={SetWan} />
                        <Route path={`${match.path}/speed`} component={Speed} />
                        <Route path={`${match.path}/setwifi`} component={SetWifi} />
                        <Redirect from={match.path} to={`${match.path}/setpassword`}></Redirect>
                    </Switch>
                </div>
            </SubLayout>
        );
    }

}







