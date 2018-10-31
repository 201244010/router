import "babel-polyfill";
import React from "react";
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {message} from 'antd';
import "./assets/styles/index.scss";
import PrimaryHeader from './components/PrimaryHeader';
import PrimaryFooter from './components/PrimaryFooter';
import CustomIcon from '~/components/Icon';
import Login from './pages/Login';
import Guide from "./pages/Guide";
import Home from './pages/Home';
import Settings from './pages/Settings';
import Advance from './pages/Advance';
import Welcome from './pages/Welcome';
import DownloadPage from './pages/DownloadPage';
import Diagnose from './pages/Diagnose';
import {brower} from './utils';
import {UserInfoContext} from './context';
import UpdateDetect from './pages/UpgradeDetect'
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
        try {
            const hasVisited = window.sessionStorage.getItem('__visited__');
            if (hasVisited !== '1' && !logined && (brower.android || brower.ios)) {
                window.location.href = '/mobile/index.html';
            }
        } catch (e) {
            alert('您可能开启了无痕浏览/隐私模式，请关闭后再重试');
        }

        return { pathname, logined };
    }

    componentDidMount() {
        // set global mesage conf
        message.config({
            top: 92,
            duration: 2,
            maxCount: 3,
        });
        //TODO: optimize me
        const welcome = '/welcome';

        // 不是在向导页面：/welcome or /guide/xxx
        if (![welcome, 'guide'].some(url => {
            return this.state.pathname.indexOf(url) > -1;
        })) {
            common.fetchApi({ opcode: 'SYSTEM_GET' }).then(res => {
                let { errcode, data } = res;
                if (0 == errcode && 1 === parseInt(data[0].result.system.factory)) {
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
            'login': { main: 'index-bg', footer: ''},
            'settings': { main: 'bg', footer: '' },
            'advance': { main: 'bg', footer: ''},
            'welcome': { main: 'index-bg', footer: '' },
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
                <div className='main-content'>
                    {/* <UserInfoContext.Provider></UserInfoContext.Provider> */}
                    <PrimaryHeader logined={logined} />
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
                            <Redirect from='/' to={redirect} />
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

const App = () => (
    <Router>
        <PrimaryLayout/>
    </Router>
);

ReactDOM.render(<App/>, document.querySelector('#wrap'));
