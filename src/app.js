import "babel-polyfill";       // 解决兼容性问题

import React from "react";
import ReactDOM from 'react-dom';

import { UA, PAGE_STYLE_KEY, PAGE_STYLE_H5, PAGE_STYLE_WEB } from './utils';
import {set} from '~/assets/common/cookie';

import Web from './pages/index.js';     // PC Web页面
import H5 from './H5';       // H5页面

const MODULE = 'app';

let web = PAGE_STYLE_WEB;
try {
    web = window.sessionStorage.getItem(PAGE_STYLE_KEY);
} catch (e) {
    alert(intl.get(MODULE, 0)/*_i18n:您可能开启了隐私模式，请关闭后重试*/);
}

// 根据UA渲染不同的页面
let App;
if (PAGE_STYLE_WEB === web) {
    App = Web;
} else if (PAGE_STYLE_H5 === web){
    App = H5;
}else {
    App = UA.mobile ? H5 : Web;
}

ReactDOM.render(<App />, document.querySelector('#wrap'));
