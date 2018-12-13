
import React from 'react';
import classnames from 'classnames';
import { Switch, Route, Redirect } from "react-router-dom";
import SetPwd from './SetPwd';
import SetWan from './SetWan';
import SetWifi from './SetWifi';
import Icon from '~/components/Icon';

import './guide.scss';

export default class Guide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            icon: 'lock'
        };
    }

    static getDerivedStateFromProps(nextProps){
        let { match } = nextProps, path = match.path, pathname = location.pathname;
        let route = pathname.replace(path + '/', '');
        const iconMap = {
            setpwd: 'lock',
            setwan: 'browser',
            setwifi: 'wifi',
        }
        return {
            icon: iconMap[route]
        };
    }   

    render(){
        const { match } = this.props, icon = this.state.icon;
        return (
            <div className='guide-container'>
                <div className="header">
                    <Icon type='logo' size={'1.3333rem'} color="#fff" />
                    <div className='step-icon'><Icon type={icon} size={'4rem'} color="#3B76E7" /></div>
                </div>
                <div className="guide-body">
                    <Switch>
                        <Route path={`${match.path}/setpwd`} component={SetPwd} />
                        <Route path={`${match.path}/setwan`} component={SetWan} />
                        <Route path={`${match.path}/setwifi`} component={SetWifi} />
                        <Redirect from={match.path} to={`${match.path}/setpwd`}></Redirect>
                    </Switch>
                </div>
            </div>
        );
    }

}
