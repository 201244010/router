

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
 * @param {json} 扩展配置 loop 是否循环 或循环 N 次, interval 轮询间隔
 * @see
 * fetchWithCode(
 *      'ACCOUNT_LOGIN', 
 *      {timeout : 3000, data : {password : '123'}},
 * );
 * fetchWithCode(
 *      'DHCPS_GET', 
 *      {timeout : 3000, data : {password : '123'}},
 *      {loop : true, interval : 1000}
 * );
 */
export function fetchWithCode(directive, options = {}, loopOption = {loop : false, interval : 300}){
    let code = DIRECTIVE[directive];
    let url = __BASEAPI__ + '/' + directive;
    let payload = code ? {opcode : code} : {};
    let method = options.method ? options.method : 'get';
    let count = 1;
    let { loop, interval } = loopOption;
    
    method = method.toLowerCase();
    payload = Object.assign(options.data || options.params || {}, payload);

    if(method === 'get'){
        options.params = {"params" : [payload]};
    }
    else if(method === 'post'){
        options.data = {"params" : [payload]};
        options.data = stringify(options.data, {encodeValuesOnly : true});
    }

    return new Promise((resolve, reject) => {
        function fetch(){
            return axios(url, options).then(function(response){
                return resolve(response);
            })
            .catch( error => {
                // console.error("axios catch error : ", error);
                switch(typeof loop){
                    case 'number' :
                        if(count < loop){
                            count++;
                            setTimeout(()=>fetch(), interval);
                            return false;
                        }
                        break;
                    case 'boolean' :
                        if(loop === true){
                            return fetch();
                        }
                        break;
                    case 'string' :
                        throw new Error('fetchWithCode 要求循环参数为 boolean 或 number');
                        break;
                }
                return reject(error);
            })
        }
        fetch();
    })
};

// export const TIMEZONES = TIMEZONE;;







