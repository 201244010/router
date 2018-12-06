import "babel-polyfill";       // 解决兼容性问题

import React from "react";
import ReactDOM from 'react-dom';

import { UA } from './utils';

import Web from './pages/index.js';     // PC Web页面
import H5 from './H5';       // H5页面

let web = '1';
try {
    web = window.sessionStorage.getItem('__visited__');
} catch (e) {
    alert('您可能开启了无痕浏览/隐私模式，请关闭后再试');
}

// 根据UA渲染不同的页面
const App = ('0' === web || UA.mobile) ? H5 : Web;

// Login H5
// window.location.href = '/mobile/index.html';

ReactDOM.render(<App />, document.querySelector('#wrap'));
