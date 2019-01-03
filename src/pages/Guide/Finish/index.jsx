import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import CreateWifi from './CreateWifi';
import UserExperience from './UserExperience';

export default class Finish extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { match } = this.props;
        
        return (
            <Switch>
                <Route path={`${match.path}/createwifi`} component={CreateWifi} />
                <Route path={`${match.path}/userexperience`} component={UserExperience} />
                <Redirect from={match.path} to={`${match.path}/createwifi`}></Redirect>
            </Switch>
        );
    }
}