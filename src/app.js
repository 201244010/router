import "babel-polyfill";
import React from "react";
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {message} from 'antd';
import "./assets/styles/index.scss";
import PrimaryHeader from './components/PrimaryHeader';
import PrimaryFooter from './components/PrimaryFooter';
import Login from './pages/Login';
import Guide from "./pages/Guide";
import Home from './pages/Home';
import Settings from './pages/Settings';
import Advance from './pages/Advance';
import Welcome from './pages/Welcome';
import DownloadPage from './pages/DownloadPage';
import Diagnose from './pages/Diagnose';
import {UserInfoContext} from './context';
// import UserBox from './components/UserBox';
// import configurestore from './pub/store/configureStore';
// const store = configurestore();
class PrimaryLayout extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        pathname: '/',
        logined: true
    };

    static getDerivedStateFromProps() {
        const pathname = location.pathname;
        const logined = document.cookie.length > 0;
        return {pathname, logined};
    }

    componentDidMount() {
        // set global mesage conf
        message.config({
            top: 0,
            duration: 2,
            maxCount: 3,
        });
    }

    render() {
        const pathname = this.state.pathname;
        let redirect = this.state.logined ? '/home' : '/login';
        const blueBgs = ['/login', '/settings', '/advance', '/welcome', '/downloadPage', '/diagnose'];
        const blueBg = blueBgs.some(url => pathname.indexOf(url) > -1);
        const klassnames = classnames(['main', {'blue-bg': blueBg}]);
        return (
            <div className="ui-fullscreen">
                {/* <UserInfoContext.Provider></UserInfoContext.Provider> */}
                <PrimaryHeader logined={this.state.logined}/>
                <div className={klassnames}>
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/guide" component={Guide}/>
                        <Route path="/home" component={Home}/>
                        <Route path="/settings" component={Settings}/>
                        <Route path="/advance" component={Advance}/>
                        <Route path='/welcome' component={Welcome}/>
                        <Route path='/downloadPage' component={DownloadPage}/>
                        <Route path='/welcome' component={Welcome}/>
                        <Route path='/diagnose' component={Diagnose}/>
                        <Redirect from='/' to={redirect}/>
                    </Switch>
                    {blueBg ? <PrimaryFooter/> : ""}
                </div>
            </div>
        );
    }
}

const App = () => (
    <Router>
        <PrimaryLayout/>
    </Router>
);

ReactDOM.render(<App/>, document.querySelector('#wrap'));
