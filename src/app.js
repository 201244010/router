import "babel-polyfill";
import React from "react";
import ReactDOM from 'react-dom';
import intl from 'react-intl-universal';
import { UA, PAGE_STYLE_KEY, PAGE_STYLE_H5, PAGE_STYLE_WEB } from './utils';
import Web from './pages/index.js';     // PC Web页面
import H5 from './H5';
import {SUPPORTED_LANG, LANGUAGE_LIST} from '~/assets/common/constants';
import locales from '~/i18n/locales.json';

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
if ('localhost' === location.hostname) {
    intl.init({
      currentLocale: 'en-us',
      locales
    });
    const result = {
        quick_setup: [
            {"name":"password","version":"1.0"},
            {"name":"network","version":"1.0"},
            {"name":"wireless","version":"1.0"},
            {"name":"timezone","version":"1.0"}
        ]
    };
    window.sessionStorage.setItem('_LANGUAGE_LIST', JSON.stringify(LANGUAGE_LIST));
    window.sessionStorage.setItem('_LANGUAGE_DEFAULT', '1');
    window.sessionStorage.setItem('_LANGUAGE', 'zh-cn');
    window.sessionStorage.setItem('_QUICK_SETUP', JSON.stringify(result.quick_setup || []));
    ReactDOM.render(<App />, document.querySelector('#wrap'));
} else {
    common.fetchApi([
        { opcode: 'SYSTEM_GET' }
    ], { ignoreErr: true }).then(res => {
        const { data, errcode } = res;
        
        if (0 === errcode) {
            const result = data[0].result.system;
            const languageList = [];
            result.language_list.map(item => {
                const lang = item.toLowerCase();
                languageList.push({key: lang, label: SUPPORTED_LANG[lang]});
            });
            intl.init({
                currentLocale: result.language.toLowerCase(),
                locales
            });
            window.sessionStorage.setItem('_LANGUAGE_LIST', JSON.stringify(languageList));
            window.sessionStorage.setItem('_LANGUAGE_DEFAULT', result.lang_default);
            window.sessionStorage.setItem('_LANGUAGE', result.language.toLowerCase());
            window.sessionStorage.setItem('_QUICK_SETUP', JSON.stringify(result.quick_setup || []));
    
            if (1 === parseInt(result.factory)) {
                window.sessionStorage.setItem('_FACTORY', 'welcome');
            } else {
                window.sessionStorage.setItem('_FACTORY', 'redirect');
            }
            ReactDOM.render(<App />, document.querySelector('#wrap'));
        } else {
            throw new Error('todo something');
        }
        
    });
}

