
import React from 'react';
// import { Switch, Route } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Privacy from './Privacy';
import Grid from '~/components/Grid';

import './guide.scss';

export default class Guide extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Grid className="steps ui-flex-column">
                <ul className="guide-header">
                    <li className="now">
                        <i className="ui-ib">1</i>
                        <span className="ui-ib">设置密码</span>
                    </li>
                    <li className="line"></li>
                    <li>
                        <i className="ui-ib">2</i>
                        <span className="ui-ib">设置上网参数</span>
                    </li>
                    <li className="line"></li>
                    <li>
                        <i className="ui-ib">3</i>
                        <span className="ui-ib">设置上下行宽带</span>
                    </li>
                    <li className="line"></li>
                    <li>
                        <i className="ui-ib">4</i>
                        <span className="ui-ib">设置无线网络</span>
                    </li>
                </ul>
                <div className="guide-body">
                    <Privacy></Privacy> 
                    {/* <Router>
                        <Switch>
                            <Route path="/" component={Privacy} />
                        </Switch>
                    </Router> */}
                </div>
            </Grid>
        );
    }

}







