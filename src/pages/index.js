import React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {SUPPORTED_LANG} from '~/assets/common/constants'
import {message} from 'antd';
import { get } from 'common/auth';
import style from "styles/index.useable.scss";
import PrimaryHeader from '~/components/PrimaryHeader';
import PrimaryFooter from '~/components/PrimaryFooter';
import CustomIcon from '~/components/Icon';
import Login from './Login';
import Guide from "./Guide";
import Home from './Home';
import Settings from './Settings';
import Advance from './Advance';
import Welcome from './Welcome';
import DownloadPage from './DownloadPage';
import Diagnose from './Diagnose';
import UpdateDetect from './UpgradeDetect';

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

        const conf = {
            'guide': { main: 'guide-bg', footer: false, header: false },
            'login': { main: 'index-bg', footer: '', header: false},
            'settings': { main: 'bg', footer: '', header: true },
            'advance': { main: 'bg', footer: '', header: true },
            'welcome': { main: 'index-bg', footer: '', header: false },
            'app': { main: 'bg', footer: '', header: true },
            'home': { main: 'home-bg', footer: 'home-footer', header: true },
            'diagnose': { main: 'dbg-bg', footer: 'dbg-footer', header: true },
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
                            <Route path="/guide" component={Guide} />
                            <Route path="/home" component={Home} />
                            <Route path="/settings" component={Settings} />
                            <Route path="/advance" component={Advance} />
                            <Route path='/app' component={DownloadPage} />
                            <Route path='/diagnose' component={Diagnose} />
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
        const welcome = '/welcome';
        const logined = !!get();
        const redirect = logined ? '/home' : '/login';

        // 向导页面（/welcome or /guide/xxx）不跳转
        if ([welcome, '/guide'].some(url => {
            return path.indexOf(url) > -1;
        })) {
            return;
        }

        // for local debug
        if ("localhost" === location.hostname) {
            this.props.history.push(redirect);
            return;
        }

        /**
         * factory -> redirect to /welcome
         * logined -> redirect to /home
         * unauth -> redirect to /login
         */
        common.fetchApi([
            { opcode: 'SYSTEM_GET' }
        ], { ignoreErr: true }).then(res => {
            let { errcode, data } = res;
            const result = data[0].result.system;
            const languageList = [];
            result.language_list.map(item => {
                const lang = item.toLowerCase();
                languageList.push({key: lang, label: SUPPORTED_LANG[lang]});
            });
            window.sessionStorage.setItem('_LANGUAGE_LIST', JSON.stringify(languageList));
            if (0 === errcode && 1 === parseInt(result.factory)) {
                this.props.history.push(welcome);
            } else {
                this.props.history.push(redirect);
            }
        });
    }

    componentDidMount() {
        this.redirect();
    }

    render() {
        return <noscript />;
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
            <PrimaryLayout />
        </Router>
    );
};
