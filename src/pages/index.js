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
import UPnP from './Advance/Systemsetup/UPnP';
import PortForwarding from './Advance/Systemsetup/PortForwarding';
import CustomRestart from './Advance/Systemsetup/CustomRestart';
import LocalUpgrade from './Advance/Systemsetup/LocalUpgrade';
import { RebootContext, RecoveryContext } from '~/context';

const MODULE = 'page';

const ContextRoute = ({ contextComponent, component, value, ...rest }) => {
    const { Provider } = contextComponent;
    const Component = component;
  
    return (
      <Route {...rest}>
        <Provider value={value}>
          <Component />
        </Provider>
      </Route>
    );
};

class PrimaryLayout extends React.Component {
    constructor(props) {
        super(props);
        this.timer = {};
    }

    state = {
        pathname: '/',
        logined: true,
        reboot: {},
        recovery: {},
    };

    setProgress = (type, record, duration) => {
        this.setState({
            [type]: Object.assign({}, this.state[type], {[record.devid]: 1})
        });
        this.timer[type] = Object.assign({}, this.timer[type]);
        this.timer[type][record.devid] = setInterval(() => {
            if (this.state[type][record.devid] > 100) {
                clearInterval(this.timer[type][record.devid]);
            } else {
                this.setState({
                    [type]: Object.assign({}, this.state[type], {[record.devid]: ++this.state[type][record.devid] || 1})
                });
            }
        }, duration * 10);
    }

    static getDerivedStateFromProps() {
        const pathname = location.pathname;
        const logined = !!get();

        return { pathname, logined };
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        document.title = intl.get(MODULE, 0)/*_i18n:商米商用路由*/;
        style.use();

        // set global mesage conf
        message.config({
            top: 92,
            duration: 3,
            maxCount: 3,
        });
    }

    render() {
        const { pathname, logined, reboot, recovery} = this.state;
        const val = {
            reboot: reboot,
            recovery: recovery,
            setProgress: this.setProgress
        }
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
            'upnp': { main: 'bg', footer: '', header: true, title: true },
            'customrestart': { main: 'bg', footer: '', header: true, title: true },
            'portforwarding': { main: 'bg', footer: '', header: true, title: true },
            'localUpgrade': { main: 'bg', footer: '', header: true, title: true },
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
        const splitResult = pathname.split('/');
        for (let url in conf) {
            if (splitResult.indexOf(url) > -1){
                node = conf[url];
                path = url;
                break;
            }
        }
        return (
            <div className={`ui-fullscreen ${node.main}`}>
                <div className='main-content'>
                    {node.header && <PrimaryHeader /> }
                    <div className="main" style={{minHeight:splitResult.length > 2 && splitResult[1] === 'routersetting' ? 'calc(100% - 140px)' : height[pathname.split('/')[1]]}}>
                    {node.title && <PrimaryTitle title={getTitle()[path].title} titleTip={getTitle()[path].titleTip} /> }
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path='/welcome' component={Welcome} />
                        <Route path='/agreement' component={UserAgreement} />
                        <Route path="/guide" component={Guide} />
                        <Route path="/home" component={Home} />
                        <Route path="/clientlist" component={ClientList} />
                        <Route path="/settings" component={Settings} />
                        <Route path="/routersetting">
                            <RouterSetting value={val}/>
                        </Route>
                        <Route path='/app' component={DownloadPage} />
                        <Route path='/diagnose' component={Diagnose} />
                        <Route path="/" exact component={Default} />
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

class RouterSetting extends React.Component {
    
    render() {
        return (
                <Switch>
                    <Route path="/routersetting" exact component={RouterSettings}/>
                    <Route path="/routersetting/wifiset" component={Wifi} />
                    <Route path="/routersetting/bandwidth" component={Bandwidth} />
                    <Route path="/routersetting/wechat" component={Wechat} />
                    <Route path="/routersetting/blacklist" component={Blacklist} />
                    <Route path="/routersetting/bootdevice" component={Bootdevice} />
                    <Route path="/routersetting/systemsetup" component={Systemsetup} />
                    <Route path="/routersetting/network" component={Network} />
                    <Route path="/routersetting/lan" component={Lan} />
                    <Route path="/routersetting/routermanage" component={RouterList} />
                    <Route path="/routersetting/dosd" component={Dosd} />
                    <Route path="/routersetting/changepassword" component={ChangePassword} />
                    <Route path="/routersetting/backup" component={Backup} />
                    <Route path="/routersetting/upgrade" component={SysUpgrade} />
                    <ContextRoute exact path="/routersetting/reboot" value={this.props.value} contextComponent={RebootContext} component={Reboot} />
                    <ContextRoute exact path="/routersetting/recovery" value={this.props.value} contextComponent={RecoveryContext} component={Recovery} />
                    <Route path="/routersetting/timeset" component={TimeZone} />
                    <Route path="/routersetting/upnp" component={UPnP} />
                    <Route path="/routersetting/portforwarding" component={PortForwarding} />
                    <Route path="/routersetting/customrestart" component={CustomRestart} />
                    <Route path="/routersetting/localUpgrade" component={LocalUpgrade} />
                </Switch>
        )
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
            <CustomIcon className='icon-earth-small' type='earth' size={500} />
            <CustomIcon className='icon-earth-big' type='earth' size={600} />
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
