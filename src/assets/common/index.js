

import Loadable from 'react-loadable';
import {DIRECTIVE} from './constants';
import axios from 'axios';
// import TIMEZONE from './timezone';
import { stringify } from 'qs';

const { assign } = Object;
const noop = () => {};

/**
 * 异步加载组件
 * @param {component} component 
 */
export const asyncImport = component => {
    return Loadable({
        loader : () => import(component),
        loading : "Loading" 
    });
};

/**
 * 获取时区
 */
export const getTimeZone = () => {
    return new Date().getTimezoneOffset() / 60;
};


/**
 * ajax封装
 * @param {string} directive api指令
 * @param {json} options axios配置
 */
export function fetchWithCode(directive, options = {}){
    let code = DIRECTIVE[directive];
    let url = __BASEAPI__ + '/' + directive;
    let payload = code ? {opcode : code} : {};
    let method = options.method ? options.method : 'get';
    
    method = method.toLowerCase();
    payload = Object.assign(options.data || options.params || {}, payload);

    if(method === 'get'){
        options.params = {"params" : [payload]};
    }
    else if(method === 'post'){
        options.data = {"params" : [payload]};
        options.data = stringify(options.data, {encodeValuesOnly : true});
    }
    return axios(url, options).catch( error => {
        console.error("axios catch error : ", error);
    })
};

// export const TIMEZONES = TIMEZONE;;







