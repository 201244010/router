
import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import configurestore from './pub/store/configureStore';
import "./assets/styles/index.scss";
import Home from './pages/Home';
import About from './pages/About';
import Topics from './pages/Topics';


const store = new configurestore();

class App extends React.Component {
    render(){
        return (
            <div>
                当前用户：<span>fx</span>
                <Router>
                    <div>
                        <ul>
                            <li> <Link to="/">Home1</Link> </li>
                            <li> <Link to="/about">About</Link> </li>
                            <li> <Link to="/topics">Topics</Link> </li>
                        </ul>
                        <Route exact path="/" component={Home} />
                        <Route path="/about" component={About} />
                        <Route path="/topics" component={Topics} />
                    </div>
                </Router>
            </div>
        );
    }
};

console.log(store);
const node = document.querySelector('#wrap');
ReactDOM.render(<App />, node);

console.log('Wake up!');


