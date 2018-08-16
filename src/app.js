
import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./assets/styles/index.scss";

import PrimaryHeader from './components/PrimaryHeader';
import Login from './pages/Login';
import Guide from "./pages/Guide";
import Home from './pages/Home';

// import UserBox from './components/UserBox';
// import { UserInfoContext } from './context';
// import configurestore from './pub/store/configureStore';
// const store = configurestore();

const PrimaryLayout = () => (
  <div className="ui-fullscreen">
      <PrimaryHeader />
      {/* <UserInfoContext.Provider value={this.state.userInfo}>
          <UserBox></UserBox>
      </UserInfoContext.Provider> */}
      <div className="main">
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/guide" component={Guide} />
        </Switch>
      </div>
  </div>
);


const App = () => (
  <Router>
    <PrimaryLayout></PrimaryLayout> 
  </Router>
);


ReactDOM.render(<App />, document.querySelector('#wrap'));



