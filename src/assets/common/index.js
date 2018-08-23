

import Loadable from 'react-loadable';
import {DIRECTIVE} from './constants';
import axios from 'axios';
// import timersManager from './timersManager';
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
 * @param {object} options axios配置
 * @param {object} loopOption 扩展配置 
 *               loopOption.loop [boolean]是否循环 或循环 N 次, 
 *               loopOption.interval [number]] 轮询间隔 ms
 *               loopOption.stop [function]
 * @see
 * fetchWithCode(
 *      'ACCOUNT_LOGIN', 
 *      {timeout : 3000, data : {password : '123'}},
 * );
 * fetchWithCode(
 *      'DHCPS_GET', 
 *      {timeout : 3000, data : {password : '123'}},
 *      {loop : true, interval : 1000, stop : function(){return true}},
 *      
 * );
 */
export function fetchWithCode(directive, options = {}, loopOption = {}){
    let code = DIRECTIVE[directive];
    let url = __BASEAPI__ + '/' + directive;
    let payload = code ? {opcode : code} : {};
    let method = options.method ? options.method : 'get';
    let count = 1;
    let { loop, interval } = Object.assign({loop : false, interval : 1000, context : this}, loopOption);
    method = method.toLowerCase();
    payload = Object.assign(options.data || options.params || {}, payload);

    if(method === 'get'){
        options.params = {"params" : [payload]};
    }
    else if(method === 'post'){
        options.data = {"params" : [payload]};
        options.data = stringify(options.data, {encodeValuesOnly : true});
    }

    if(loopOption.loop && typeof loopOption.stop !== 'function'){
        throw new Error('loopOption.stop must be function, because loopOption.loop is active');
    }

    const promise = new Promise((resolve, reject) => {
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
                            if(!loopOption.stop()){
                                setTimeout(()=>fetch(), interval);
                            }
                            return false;
                        }
                        break;
                    case 'boolean' :
                        if(loop === true){
                            if(!loopOption.stop()){
                                setTimeout(()=>fetch(), interval);
                            }
                            return false;
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
    
    return promise;
};

// export const TIMEZONES = TIMEZONE;;
// export const timersManager = timersManager;





