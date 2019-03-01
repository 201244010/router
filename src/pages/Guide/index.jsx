
import React from 'react';
import classnames from 'classnames';
import { Switch, Route, Redirect } from "react-router-dom";
import SubLayout from '~/components/SubLayout';
import SetPassword from './SetPassword';
import TimeZone from './GuideTimeZone';
import SetWan from './SetWan';
// import Speed from './Speed';
import SetWifi from './SetWifi';
import Success from './Success';
// import Finish from './Finish';
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

    steps = [
        {route: 'setpassword', component: SetPassword, lang: intl.get(MODULE, 0)/*_i18n:设置管理密码*/},
        {route: 'timezone', component: TimeZone, lang: intl.get(MODULE, 3)/*_i18n:设置完成*/},
        {route: 'setwan', component: SetWan, lang: intl.get(MODULE, 1)/*_i18n:设置上网参数*/},
        {route: 'setwifi', component: SetWifi, lang: intl.get(MODULE, 2)/*_i18n:设置无线网络*/},
        // {route: 'finish', component: Finish, lang: intl.get(MODULE, 3)/*_i18n:设置完成*/},
    ];

    getVersion = () => {
        let QUICK_SETUP = JSON.parse(window.sessionStorage.getItem('QUICK_SETUP'));     //获取版本信息

        if (3 === QUICK_SETUP.length) {             //根据快速设置的步骤数，判断是国内版还是海外版
            return "domestic";
        }

        if (4 === QUICK_SETUP.length) {
            return "abroad";
        }
    }

    static getDerivedStateFromProps(nextProps){
        let { match } = nextProps, path = match.path, pathname = location.pathname;
        let route = pathname.replace(path + '/', '').replace(/\/.*/gi, '');
        return {
            activeRouteName : route
        };
    }   

    // 根据路由或得当前菜单的 class list
    initStepMenu(route, index, total){
        let activeRouteName = this.state.activeRouteName;
        return classnames({
            now : activeRouteName === route,
            done : (index >= total)
        });
    }

    render(){
        const path = this.props.match.path;
        let activeRouteName = this.state.activeRouteName;
        let current_steps = [];
        if ('domestic' === this.getVersion()) {
            current_steps = [
                {route: 'setpassword', component: SetPassword, lang: intl.get(MODULE, 0)/*_i18n:设置管理密码*/},
                // {route: 'timezone', component: TimeZone, lang: intl.get(MODULE, 3)/*_i18n:设置完成*/},
                {route: 'setwan', component: SetWan, lang: intl.get(MODULE, 1)/*_i18n:设置上网参数*/},
                {route: 'setwifi', component: SetWifi, lang: intl.get(MODULE, 2)/*_i18n:设置无线网络*/},
                // {route: 'finish', component: Finish, lang: intl.get(MODULE, 3)/*_i18n:设置完成*/},
            ];
        }

        if ('abroad' === this.getVersion()) {
            current_steps = [
                {route: 'setpassword', component: SetPassword, lang: intl.get(MODULE, 0)/*_i18n:设置管理密码*/},
                {route: 'timezone', component: TimeZone, lang: intl.get(MODULE, 3)/*_i18n:设置完成*/},
                {route: 'setwan', component: SetWan, lang: intl.get(MODULE, 1)/*_i18n:设置上网参数*/},
                {route: 'setwifi', component: SetWifi, lang: intl.get(MODULE, 2)/*_i18n:设置无线网络*/},
                // {route: 'finish', component: Finish, lang: intl.get(MODULE, 3)/*_i18n:设置完成*/},
            ];
        }

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
                {'success' !== activeRouteName && <ul className="guide-header">
                {
                    current_steps.map((step, index, array) => {
                        return (
                            <React.Fragment>
                                <li className={this.initStepMenu(step.route, index, array.length)}>
                                    <i className="ui-ib order-num">{index + 1}</i>
                                    <Icon type="correct" color="#fff" size={26} />
                                    <span className="ui-ib">{step.lang}</span>
                                </li>
                                {(index < array.length - 1) &&
                                    <li className='line'></li>
                                }
                            </React.Fragment>
                        );
                    })
                }
                </ul>}
                <div className="guide-body">
                    <Switch>
                        {
                            current_steps.map((step, index, array) => {
                                return <Route path={`${path}/${step.route}`} component={step.component} />;
                            })
                        }
                        <Route path={`${path}/success`} component={Success} />
                        <Redirect from={path} to={`${path}/${current_steps[0].route}`}></Redirect>
                    </Switch>
                </div>
            </SubLayout>
        );
    }

}







