import "babel-polyfill";
import React from "react";
import ReactDOM from 'react-dom';
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
        return { pathname, logined };
    }

    componentDidMount() {
        // set global mesage conf
        message.config({
            top: 0,
            duration: 2,
            maxCount: 3,
        });

        //TODO: optimize me
        const welcome = '/welcome';
        if (this.state.pathname.indexOf(welcome) <= -1) {
            common.fetchApi({ opcode: 'SYSTEM_GET' }).then(res => {
                let { errcode, data } = res;
                if ("1" == data[0].result.system.factory) {
                    location.href = welcome;
                }
            });
        }
    }

    render() {
        const { pathname, logined } = this.state;
        const redirect = logined ? '/home' : '/login';

        const conf = {
            'guide': { main: 'guide-bg', footer: false },
            'login': {main: 'bg', footer: ''},
            'settings': { main: 'bg', footer: '' },
            'advance': { main: 'bg', footer: ''},
            'welcome': { main: 'bg', footer: '' },
            'app': { main: 'bg', footer: ''},

            'home': { main: 'home-bg', footer: 'home-footer' },
            'diagnose': { main: 'dbg-bg', footer: 'dbg-footer' },
        };

        let node = {main: '', footer: false};
        for (let url in conf) {
            if (pathname.indexOf(url) > -1){
                node = conf[url];
                break;
            }
        }

        return (
            <div className={`ui-fullscreen ${node.main}`}>
                {/* <UserInfoContext.Provider></UserInfoContext.Provider> */}
                <PrimaryHeader logined={logined} />
                <div className="main">
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/guide" component={Guide}/>
                        <Route path="/home" component={Home}/>
                        <Route path="/settings" component={Settings}/>
                        <Route path="/advance" component={Advance}/>
                        <Route path='/welcome' component={Welcome}/>
                        <Route path='/app' component={DownloadPage}/>
                        <Route path='/welcome' component={Welcome}/>
                        <Route path='/diagnose' component={Diagnose}/>
                        <Redirect from='/' to={redirect}/>
                    </Switch>
                    {false !== node.footer && <PrimaryFooter className={node.footer}/>}
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
