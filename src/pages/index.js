import React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {message} from 'antd';
import { get } from 'common/auth';
import style from "styles/index.useable.scss";
import PrimaryHeader from '~/components/PrimaryHeader';
import PrimaryFooter from '~/components/PrimaryFooter';
import CustomIcon from '~/components/Icon';
import SubLayout from '~/components/SubLayout';

import Login from './Login';
import Guide from "./Guide";
import Home from './Home';
import ClientList from './ClientList';
import Settings from './Settings';
import RouterSettings from './RouterSettings';
import Welcome from './Welcome';
import DownloadPage from './DownloadPage';
import Diagnose from './Diagnose';
import UpdateDetect from './UpgradeDetect';
import UserAgreement from './UserAgreement';

import Wechat from './Advance/Wechat';
import Blacklist from './Advance/Blacklist';
import Bootdevice from './Advance/Bootdevice';
import Bandwidth from './Advance/Bandwidth';
import Systemsetup from './Advance/Systemsetup';

import Wifi from './Settings/WI-Fi';
import Lan from './Settings/Lan';
import Network from './Settings/Network';

import Dosd from './Advance/Systemsetup/Dosd';
import ChangePassword from './Advance/Systemsetup/ChangePassword';
import SysUpgrade from './Advance/Systemsetup/SysUpgrade';
import Backup from './Advance/Systemsetup/Backup';
import TimeZone from './Advance/Systemsetup/TimeZone';
import Reboot from './Advance/Systemsetup/Reboot';
import Recovery from './Advance/Systemsetup/Recovery';

const MODULE = 'page';

class PrimaryLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        pathname: '/',
        logined: true
    };

    static getDerivedStateFromProps() {
        const pathname = location.pathname;
        const logined = !!get();

        return { pathname, logined };
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        document.title = intl.get(MODULE, 0);
        style.use();

        // set global mesage conf
        message.config({
            top: 92,
            duration: 3,
            maxCount: 3,
        });
    }

    render() {
        const { pathname, logined } = this.state;

        const routerSetting = {
            'wechat': { main: 'bg', footer: '', header: true },
            'blacklist': { main: 'bg', footer: '', header: true },
            'bandwidth': { main: 'bg', footer: '', header: true },
            'bootdevice': { main: 'bg', footer: '', header: true },
            'systemsetup': { main: 'bg', footer: '', header: true },
            'wifi': { main: 'bg', footer: '', header: true },
            'network': { main: 'bg', footer: '', header: true },
            'lan': { main: 'bg', footer: '', header: true },
            'dosd': { main: 'bg', footer: '', header: true },
            'changepassword': { main: 'bg', footer: '', header: true },
            'upgrade': { main: 'bg', footer: '', header: true },
            'backup': { main: 'bg', footer: '', header: true },
            'reboot': { main: 'bg', footer: '', header: true },
            'recovery': { main: 'bg', footer: '', header: true },
            'timezone': { main: 'bg', footer: '', header: true },
        }

        const conf = {
            'guide': { main: 'guide-bg', footer: false, header: false },
            'login': { main: 'index-bg', footer: '', header: false},
            'clientlist': { main: 'bg', footer: '', header: true},
            'settings': { main: 'bg', footer: '', header: true },
            'routersetting': { main: 'bg', footer: '', header: true },
            'welcome': { main: 'index-bg', footer: '', header: false },
            'agreement': { main: '', footer: '', header: false },
            'app': { main: 'bg', footer: '', header: true },
            'home': { main: 'home-bg', footer: 'home-footer', header: true },
            'diagnose': { main: 'dbg-bg', footer: 'dbg-footer', header: true },
            ...routerSetting,
        };

        let node = {main: '', footer: false, header: true};
        for (let url in conf) {
            if (pathname.indexOf(url) > -1){
                node = conf[url];
                break;
            }
        }

        return (
            <div className={`ui-fullscreen ${node.main}`}>
                <div className='main-content'>
                    {node.header && <PrimaryHeader /> }
                    <div className="main">
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route path='/welcome' component={Welcome} />
                            <Route path='/agreement' component={UserAgreement} />
                            <Route path="/guide" component={Guide} />
                            <Route path="/home" component={Home} />
                            <Route path="/clientlist" component={ClientList} />
                            <Route path="/settings" component={Settings} />
                            <Route path="/routersetting" component={RouterSettings} />
                            <Route path='/app' component={DownloadPage} />
                            <Route path='/diagnose' component={Diagnose} />
                            <Route path="/bandwidth" component={Bandwidth} />
                            <Route path="/wechat" component={Wechat} />
                            <Route path="/blacklist" component={Blacklist} />
                            <Route path="/bootdevice" component={Bootdevice} />
                            <Route path="/systemsetup" component={Systemsetup} />
                            <Route path="/wifi" component={Wifi} />
                            <Route path="/network" component={Network} />
                            <Route path="/lan" component={Lan} />
                            <Route path="/dosd" component={Dosd} />
                            <Route path="/changepassword" component={ChangePassword} />
                            <Route path="/upgrade" component={SysUpgrade} />
                            <Route path="/backup" component={Backup} />
                            <Route path="/reboot" component={Reboot} />
                            <Route path="/recovery" component={Recovery} />
                            <Route path="/timezone" component={TimeZone} />
                            <Route path="/" component={Default} />
                        </Switch>
                        {false !== node.footer && <PrimaryFooter className={node.footer} />}
                        {logined && <UpdateDetect />}
                    </div>
                </div>
                <Background image={require('~/assets/images/noise.png')} />
            </div>
        );
    }
}

class Default extends React.Component{
    constructor(props) {
        super(props);
    }
    
    redirect() {
        const path = location.pathname;
        const logined = !!get();        
        const paths = {
            welcome: '/welcome',
            redirect: logined ? '/home' : '/login'
        };

        // 向导页面（/welcome or /guide/xxx）不跳转
        if ([paths.welcome, '/guide'].some(url => path.indexOf(url) > -1)) {
            return;
        }

        // for local debug
        if ("localhost" === location.hostname) {
            this.props.history.push(paths.redirect);
            return;
        }

        /**
         * factory -> redirect to /welcome
         * logined -> redirect to /home
         * unauth -> redirect to /login
         */
        this.props.history.push(paths[window.sessionStorage.getItem("_FACTORY")]);
    }

    componentDidMount() {
        this.redirect();
    }

    render() {
        return <noscript/>;
    }
}

function Background(props) {
    return (
        <div className='bg-items'>
            <i className='noise' style={{
                backgroundImage: `url(${props.image})`,
            }}></i>
            <CustomIcon type='earth' size={500} style={{
                color: '#FFF',
                opacity: 0.05,
                position: 'fixed',
                top: '-88px',
                right: '-129px',
            }} />
            <CustomIcon type='earth' size={600} style={{
                color: '#FFF',
                opacity: 0.1,
                position: 'fixed',
                bottom: '-40px',
                left: '-220px',
            }} />
        </div>
    )
}

export default function App() {
    return (
        <Router>
            <PrimaryLayout/>
        </Router>
    );
};
