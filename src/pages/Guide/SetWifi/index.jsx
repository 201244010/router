import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Setting from './SetWifi';
import Applying from './Applying';

import './setwifi.scss';

const MODULE = 'setwifi';
export default class SetWifi extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { match } = this.props;

        return (
            <div className="setwifi">
                <h2>{intl.get(MODULE, 19)/*_i18n:设置Wi-Fi*/}</h2> 
                <p className="ui-tips guide-tip">{intl.get(MODULE, 20)/*_i18n:设置商户Wi-Fi、客用Wi-Fi的名称与密码*/}</p>
                <Switch>
                    <Route path={`${match.path}/setWifi`} component={Setting} />
                    <Route path={`${match.path}/applying/:param`} component={Applying} />
                    <Redirect from={match.path} to={`${match.path}/setWifi`}></Redirect>   
                </Switch>
            </div>   
        );
    }
}