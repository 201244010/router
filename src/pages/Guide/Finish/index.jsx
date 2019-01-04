import React from 'react';
import { Switch, Route } from "react-router-dom";
import Applying from './Applying';
import Success from './Success';

export default class Finish extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { match } = this.props;
        
        return (
            <Switch>
                <Route path={`${match.path}/applying/:param`} component={Applying} />
                <Route path={`${match.path}/success`} component={Success} />
            </Switch>
        );
    }
}