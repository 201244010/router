import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Setting from './SetWifi';
import Applying from './Applying';

import './setwifi.scss';

export default class SetWifi extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route path={`${match.path}/setWifi`} component={Setting} />
                <Route path={`${match.path}/applying/:param`} component={Applying} />
                <Redirect from={match.path} to={`${match.path}/setWifi`}></Redirect>   
            </Switch>
        );
    }
}