import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Preparing from './Preparing';
import Setting from './Setting';
import Finish from './Finish';

export default class AddSubRouter extends React.Component {
    constructor (props) {
        super (props);
    }

    render () {
        return (
            <Switch>
                <Route path={`${match.path}/preparing`} component={Preparing} />
                <Route path={`${match.path}/setting`} component={Setting} />
                <Route path={`${match.path}/finish`} component={Finish} />
                <Redirect from={match.path} to={`${match.path}/preparing`}></Redirect>
            </Switch>
        );
    }
}