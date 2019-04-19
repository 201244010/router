import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Preparing from './Preparing';
import Setting from './Setting';

export default class AddSubRouter extends React.Component {
    constructor (props) {
        super (props);
    }

    render () {
        const { match } = this.props;
        return (
            <Switch>
                <Route path={`${match.path}/preparing`} component={Preparing} />
                <Route path={`${match.path}/setting`} component={Setting} />
                <Redirect from={match.path} to={`${match.path}/preparing`}></Redirect>
            </Switch>
        );
    }
}