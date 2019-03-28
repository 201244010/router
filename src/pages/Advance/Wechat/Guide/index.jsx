
import React from 'react';
import classnames from 'classnames';
import { Switch, Route, Redirect } from "react-router-dom";
import Icon from '~/components/Icon';
import SubLayout from '~/components/SubLayout';

import Welcome from './Welcome';
import Account from './Account';
import Wifi from './Wifi';

import style from './guide.useable.scss';

export default class Guide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeRouteName: '',
        };
    }

    steps = [
        { route: 'welcome', title: '设置您的欢迎页' },
        { route: 'account', title: '填写您的公众号信息' },
        { route: 'wifi', title: '设置顾客上网时长' },
    ];

    dones = {
        welcome: [],
        account: ['welcome'],
        wifi: ['welcome', 'account']
    };

    static getDerivedStateFromProps(nextProps) {
        let { match } = nextProps, path = match.path, pathname = location.pathname;
        let route = pathname.replace(path + '/', '').replace(/\/.*/gi, '');
        return {
            activeRouteName: route
        };
    }

    // 根据路由或得当前菜单的 class list
    initStepMenu(step) {
        let activeRouteName = this.state.activeRouteName;
        return classnames({
            active: activeRouteName === step,
            done: this.dones[activeRouteName] && this.dones[activeRouteName].indexOf(step) > -1
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        style.use();
    }

    render() {
        const { match } = this.props;
        return (
            <SubLayout className="settings">
            <div className='wechat-guide'>
                <ul className='setup-list'>
                    {this.steps.map((item, index, steps) => {
                        let className = this.initStepMenu(item.route);
                        return Step({
                            className,
                            step: index + 1,
                            title: item.title,
                            line: (index < steps.length - 1)
                        });
                    })}
                </ul>
                <div className="setup-body">
                    <Switch>
                        <Route path={`${match.path}/welcome`} component={Welcome} />
                        <Route path={`${match.path}/account/:param`} component={Account} />
                        <Route path={`${match.path}/wifi/:param`} component={Wifi} />
                        <Redirect from={match.path} to={`${match.path}/welcome`}></Redirect>
                    </Switch>
                </div>
            </div>
        </SubLayout>
        );
    }
}

const Step = function(props) {
    const {className, step, title, line} = props;
    return (
        <li key={step} className={classnames(['setup-step', className])}>
            <span className='step-num'>{step}</span>
            { className.indexOf('done') > -1 &&
                <Icon type="correct" color="#333C4F" size={26} />
            }
            <span className='title'>{title}</span>
            { line && <Line />}
        </li>
    );
}

const Line = function() {
    let i = 0, dots = [];
    for (i = 0; i < 16; i++) {
        dots.push(<i key={i} className='line-dot'></i>);
    }

    return (
        <span className='step-line'>{dots}</span>
    );
}