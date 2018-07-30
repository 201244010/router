
import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import configurestore from './pub/store/configureStore';
import "./assets/styles/index.scss";

import Header from './components/Header/header';


import UserBox from './components/UserBox';
import { UserInfoContext } from './context';
import Home from './pages/Home';
import About from './pages/About';
import Topics from './pages/Topics';
import Login from './pages/Login';

const store = configurestore();

class App extends React.Component {
    constructor(props){
        super(props);
        // this.state = {
        //     userInfo : {
        //         name : '数据请求中...'
        //     }
        // };
    }

    componentDidMount(){
        // setTimeout(() => {
        //     this.setState( (prev, state) => (
        //         {
        //             userInfo : {
        //                 name : '奥巴马'
        //             }
        //         }
        //     ));
        // }, 3000);
    }

    render(){
        return (
            <div className="ui-fullscreen">
                <Header />
                {/* <UserInfoContext.Provider value={this.state.userInfo}>
                    <UserBox></UserBox>
                </UserInfoContext.Provider> */}
                <div className="container">
                    <Router>
                        <Switch>
                            <Route path="/login" component={Login} />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
};

console.log(store);
const node = document.querySelector('#wrap');
ReactDOM.render(<App />, node);

console.log('Wake up!');


