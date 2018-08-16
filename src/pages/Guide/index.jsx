
import React from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SetPassword from './SetPassword';
import SubLayout from '~/components/SubLayout';

import './guide.scss';


const Start = props => {
    return <div>开始设置</div>
};

export default class Guide extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const { match } = this.props;
        return (
            <SubLayout className="steps">
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
                    <Switch>
                        {/* <Route path={match.path} exact component={Start}></Route> */}
                        <Route path={`${match.path}/setpassword`} component={SetPassword} />
                        <Redirect from={match.path} to={`${match.path}/setpassword`}></Redirect>
                    </Switch>
                </div>
            </SubLayout>
        );
    }

}







