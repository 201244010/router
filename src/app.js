
import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./assets/styles/index.scss";

import Header from './components/Header/header';


// import UserBox from './components/UserBox';
// import { UserInfoContext } from './context';

import Login from './pages/Login';
import Guide from "./pages/Guide";
// import configurestore from './pub/store/configureStore';
// const store = configurestore();

class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){}

    render(){
        return (
            <div className="ui-fullscreen">
                <Header />
                {/* <UserInfoContext.Provider value={this.state.userInfo}>
                    <UserBox></UserBox>
                </UserInfoContext.Provider> */}
                <div className="main">
                    <Router>
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route path="/guide" component={Guide} />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
};

const node = document.querySelector('#wrap');
ReactDOM.render(<App />, node);

