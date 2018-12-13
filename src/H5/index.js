import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import 'lib-flexible/flexible.js';

import normalize from './assets/styles/normalize.useable.scss';
import "styles/font/iconfont.css";

import Home from './pages/Home';
import Welcome from "./pages/Welcome";
import Guide from "./pages/Guide";

class PrimaryLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        normalize.use();
    }

    componentWillUnmount() {
        normalize.unuse();
    }

    render() {
        return (
            <div className="main">
                <Switch>
                    <Route path="/home" component={Home} />
                    <Route path="/welcome" component={Welcome} />
                    <Route path="/guide" component={Guide} />
                    <Route path="/" component={Default} />
                </Switch>
            </div>
        );
    }
}

class Default extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    redirect() {
        const path = location.pathname;
        const welcome = '/welcome';

        const home = 'home';

        // 向导页面（/welcome or /guide/xxx）不跳转
        if ([welcome, '/guide'].some(url => {
            return path.indexOf(url) > -1;
        })) {
            return;
        }

        // for local debug
        if ("localhost" === location.hostname) {
            this.props.history.push(home);
            return;
        }

        /**
         * factory -> redirect to /welcome
         * others -> redirect to /home
         */
        common.fetchApi({ opcode: 'SYSTEM_GET' }).then(res => {
            let { errcode, data } = res;
            if (0 == errcode && 1 === parseInt(data[0].result.system.factory)) {
                this.props.history.push(welcome);
            } else {
                this.props.history.push(home);
            }
        });
    }

    componentDidMount() {
        this.redirect();
    }

    render() {
        return null;
    }
}

export default function App() {
    return (
        <Router>
            <PrimaryLayout />
        </Router>
    );
};
