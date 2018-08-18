
import React from 'react';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SetPassword from './SetPassword';
import SetWan from './SetWan';
import Speed from './Speed';
import SubLayout from '~/components/SubLayout';

import './guide.scss';


const Start = props => {
    return <div>开始设置</div>
};

export default class Guide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeRouteName : ''
        };
    }

    static getDerivedStateFromProps(nextProps){
        console.log(nextProps);
        let { match } = nextProps, path = match.path, pathname = location.pathname;
        let route = pathname.replace(path + '/', '');
        return {
            activeRouteName : route
        };
    }

    render(){
        const { match } = this.props, activeRouteName = this.state.activeRouteName;
        return (
            <SubLayout className="steps">
                <ul className="guide-header">
                    <li className={classnames({ now : activeRouteName === 'setpassword' })}>
                        <i className="ui-ib">1</i>
                        <span className="ui-ib">设置密码</span>
                    </li>
                    <li className="line"></li>
                    <li className={classnames({ now : activeRouteName === 'setwan' })}>
                        <i className="ui-ib">2</i>
                        <span className="ui-ib">设置上网参数</span>
                    </li>
                    <li className="line"></li>
                    <li className={classnames({ now : activeRouteName === 'speed' })}>
                        <i className="ui-ib">3</i>
                        <span className="ui-ib">设置上下行宽带</span>
                    </li>
                    <li className="line"></li>
                    <li className={classnames({ now : activeRouteName === 'wifi' })}>
                        <i className="ui-ib">4</i>
                        <span className="ui-ib">设置无线网络</span>
                    </li>
                </ul>
                <div className="guide-body">
                    <Switch>
                        {/* <Route path={match.path} exact component={Start}></Route> */}
                        <Route path={`${match.path}/setpassword`} component={SetPassword} />
                        <Route path={`${match.path}/setwan`} component={SetWan} />
                        <Route path={`${match.path}/speed`} component={Speed} />
                        <Redirect from={match.path} to={`${match.path}/setpassword`}></Redirect>
                    </Switch>
                </div>
            </SubLayout>
        );
    }

}







