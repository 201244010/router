
import React from 'react';
import classnames from 'classnames';
import { Switch, Route, Redirect } from "react-router-dom";
import SubLayout from '~/components/SubLayout';
import SetPassword from './SetPassword';
import TimeZone from './TimeZone';
import SetWan from './SetWan';
// import Speed from './Speed';
import SetWifi from './SetWifi';
import Finish from './Finish';
import Icon from '~/components/Icon';

import './guide.scss';

const MODULE = 'guide';

export default class Guide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeRouteName : '',
        };
    }

    dones = {
        setpassword: [],
        setwan: ['setpassword'],
        // speed: ['setpassword', 'setwan'],
        setwifi: ['setpassword', 'setwan', 'speed'],
        finish: ['setpassword', 'setwan', 'speed', 'setwifi'],
    };

    static getDerivedStateFromProps(nextProps){
        let { match } = nextProps, path = match.path, pathname = location.pathname;
        let route = pathname.replace(path + '/', '').replace(/\/.*/gi, '');
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
        return (
            <SubLayout className="steps ui-relative">
                <div className="header">
                    <ul>
                        <li>
                            <div className="ui-ib logo">
                                <Icon type="logo" size={40} color="#fff" />
                            </div>
                        </li>
                    </ul>
                </div>
                <ul className="guide-header">
                    <li className={this.initStepMenu('setpassword')}>
                        <i className="ui-ib order-num">1</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">{intl.get(MODULE, 0)}</span>
                    </li>
                    <li className="line"></li>
                    <li className={this.initStepMenu('setwan')}>
                        <i className="ui-ib order-num">2</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">{intl.get(MODULE, 1)}</span>
                    </li>
                    {/* <li className="line"></li>
                    <li className={this.initStepMenu('speed')}>
                        <i className="ui-ib order-num">3</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">设置上下行带宽</span>
                    </li> */}
                    <li className="line"></li>
                    <li className={this.initStepMenu('setwifi')}>
                        <i className="ui-ib order-num">3</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">{intl.get(MODULE, 2)}</span>
                    </li>
                    <li className="line"></li>
                    <li className={this.initStepMenu('finish')}>
                        <i className="ui-ib order-num">4</i>
                        <Icon type="correct" color="#fff" size={26} />
                        <span className="ui-ib">{intl.get(MODULE, 3)}</span>
                    </li>
                </ul>
                <div className="guide-body">
                    <Switch>
                        <Route path={`${match.path}/setpassword`} component={SetPassword} />
                        <Route path={`${match.path}/timezone`} component={TimeZone} />
                        <Route path={`${match.path}/setwan`} component={SetWan} />
                        {/* <Route path={`${match.path}/speed`} component={Speed} /> */}
                        <Route path={`${match.path}/setwifi`} component={SetWifi} />
                        <Route path={`${match.path}/finish`} component={Finish} />
                        <Redirect from={match.path} to={`${match.path}/setpassword`}></Redirect>
                    </Switch>
                </div>
            </SubLayout>
        );
    }

}







