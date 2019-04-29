import React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {message} from 'antd';
import { get } from 'common/auth';
import { getTitle } from 'common/title';
import style from "styles/index.useable.scss";
import PrimaryHeader from '~/components/PrimaryHeader';
import PrimaryFooter from '~/components/PrimaryFooter';
import PrimaryTitle from '~/components/PrimaryTitle';
import CustomIcon from '~/components/Icon';

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
import RouterList from './Settings/Router';
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
            'wechat': { main: 'bg', footer: '', header: true, title: true},
            'blacklist': { main: 'bg', footer: '', header: true, title: true },
            'bandwidth': { main: 'bg', footer: '', header: true, title: true },
            'bootdevice': { main: 'bg', footer: '', header: true, title: true },
            'systemsetup': { main: 'bg', footer: '', header: true, title: true },
            'wifiset': { main: 'bg', footer: '', header: true , title: true},
            'network': { main: 'bg', footer: '', header: true, title: true },
            'lan': { main: 'bg', footer: '', header: true, title: true },
            'routermanage': { main: 'bg', footer: '', header: true, title: true },
            'dosd': { main: 'bg', footer: '', header: true, title: true },
            'changepassword': { main: 'bg', footer: '', header: true, title: true },
            'upgrade': { main: 'bg', footer: '', header: true, title: true },
            'backup': { main: 'bg', footer: '', header: true, title: true },
            'reboot': { main: 'bg', footer: '', header: true, title: true },
            'recovery': { main: 'bg', footer: '', header: true, title: true },
            'timeset': { main: 'bg', footer: '', header: true, title: true },
        }

        const height = {
            'routersetting': 'calc(100% - 148px)',
            'clientlist': 'calc(100% - 148px)',
            'guide': 'calc(100% - 76px)',
            'welcome': 'calc(100% - 76px)',
            'login': 'calc(100% - 76px)',
        }

        const conf = {
            ...routerSetting,
            'guide': { main: 'guide-bg', footer: '', header: false, title: false },
            'login': { main: 'index-bg', footer: '', header: false, title: false },
            'clientlist': { main: 'bg', footer: '', header: true, title: false },
            'settings': { main: 'bg', footer: '', header: true, title: false  },
            'routersetting': { main: 'bg', footer: '', header: true, title: false },
            'welcome': { main: 'index-bg', footer: '', header: false, title: false },
            'agreement': { main: '', footer: '', header: false, title: false  },
            'app': { main: 'bg', footer: '', header: true , title: false },
            'home': { main: 'home-bg', footer: 'home-footer', header: true, title: false  },
            'diagnose': { main: 'dbg-bg', footer: 'dbg-footer', header: true , title: false },
        };

        let node = {main: '', footer: false, header: true, title: false };
        let path;
        for (let url in conf) {
            if (pathname.indexOf(url) > -1){
                node = conf[url];
                path = url;
                break;
            }
        }
        return (
            <div className={`ui-fullscreen ${node.main}`}>
                <div className='main-content'>
                    {node.header && <PrimaryHeader /> }
                    <div className="main" style={{height: height[pathname.split('/')[1]] || 'calc(100% - 141px)'}}>
                    {node.title && <PrimaryTitle title={getTitle()[path].title} titleTip={getTitle()[path].titleTip} /> }
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
                            <Route path="/wifiset" component={Wifi} />
                            <Route path="/network" component={Network} />
                            <Route path="/lan" component={Lan} />
                            <Route path="/routermanage" component={RouterList} />
                            <Route path="/dosd" component={Dosd} />
                            <Route path="/changepassword" component={ChangePassword} />
                            <Route path="/upgrade" component={SysUpgrade} />
                            <Route path="/backup" component={Backup} />
                            <Route path="/reboot" component={Reboot} />
                            <Route path="/recovery" component={Recovery} />
                            <Route path="/timeset" component={TimeZone} />
                            <Route path="/" component={Default} />
                        </Switch>
                    </div>
                    {false !== node.footer && <PrimaryFooter className={node.footer} />}
                    {logined && <UpdateDetect />}
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
