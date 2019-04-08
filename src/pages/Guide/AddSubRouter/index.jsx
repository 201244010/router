import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Preparing from './Preparing';
import Setting from './Setting';
import Location from './Location';
import Finish from './Finish';

export default class AddSubRouter extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const path = this.props.match.path;
        return (
            <Switch>
                <Route path={`${path}/preparing`} component={Preparing} />
                <Route path={`${path}/setting`} component={Setting} />
                <Route path={`${path}/location`} component={Location} />
                <Route path={`${path}/finish`} component={Finish} />
                <Redirect from={path} to={`${path}/preparing`}></Redirect>
            </Switch>
        );
    }
}