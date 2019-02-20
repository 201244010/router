
import React from "react";
import './agreement.scss';
import {Switch, Route, Redirect} from "react-router-dom";

import Agreement from './agreement';
import Privacy from './privacy';

export default class UserAgreement extends React.Component{
    constructor(props){
        super(props)
    }
    
    render(){
        const {match} = this.props;
        return (         
            <Switch>
                <Route path={`${match.path}/user`} component={Agreement} />
                <Route path={`${match.path}/secret`} component={Privacy} />
                <Redirect from={match.path} to={`${match.path}/user`}></Redirect>
            </Switch>
        )
    }
}