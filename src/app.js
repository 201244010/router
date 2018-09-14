
import React from "react";
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./assets/styles/index.scss";

import PrimaryHeader from './components/PrimaryHeader';
import PrimaryFooter from './components/PrimaryFooter';
import Login from './pages/Login';
import Guide from "./pages/Guide";
import Home from './pages/Home';
import Settings from './pages/Settings';

import { UserInfoContext } from './context';

// import UserBox from './components/UserBox';
// import configurestore from './pub/store/configureStore';
// const store = configurestore();

class PrimaryLayout extends React.Component {
    constructor(props){ super(props) }

    state = { 
        pathname : '/',
        logined : true
    };
    
    static getDerivedStateFromProps (){
        const pathname = location.pathname;
        return { pathname };
    }

    render(){
        const pathname = this.state.pathname;
        const blueBg = pathname === '/login' || pathname.indexOf('/settings') > -1;
        // console.log(pathname, blueBg);
        const klassnames = classnames(['main', {'blue-bg' : blueBg}]);
        return (
            <div className="ui-fullscreen">
                {/* <UserInfoContext.Provider></UserInfoContext.Provider> */}
                <PrimaryHeader logined={this.state.logined} />
                <div className={klassnames}>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/guide" component={Guide} />
                        <Route path="/settings" component={Settings} />
                    </Switch>
                    {blueBg ? <PrimaryFooter/> : ""}
                </div>
            </div>
        );
    }
};


const App = () => (
  <Router>
    <PrimaryLayout></PrimaryLayout> 
  </Router>
);


ReactDOM.render(<App />, document.querySelector('#wrap'));



