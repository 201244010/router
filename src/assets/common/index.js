

import Loadable from 'react-loadable';
import {DIRECTIVE} from './constants';
import axios from 'axios';
import { Modal } from 'antd';
import React from 'react';
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
 *               loopOption.stop [function] 轮询终止的条件
 *               loopOption.pending [function] 已经成功响应，仍需继续轮询的条件
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
    options = assign({timeout : 3000}, options);
    let code = DIRECTIVE[directive];
    let url = __BASEAPI__ ; //+ '/' + directive;
    let payload;    
    let method = options.method ? options.method : 'get';
    let count = 1;
    let { loop, interval } = Object.assign({loop : false, interval : 1000, pending : noop }, loopOption);
    method = method.toLowerCase();
    payload = {
        param : assign(options.data || options.params || {}),
        opcode : code
    };

    if(method === 'get'){
        options.params = {"params" : [payload], count : "1"};
    }
    else if(method === 'post'){
        options.data = {"params" : [payload], count : "1"};
    }
    if(loopOption.loop && typeof loopOption.stop !== 'function'){
        throw new Error('loopOption.stop must be function, because loopOption.loop is active');
    }
    const promise = new Promise((resolve, reject) => {
        function fetch(){
            return axios(url, options).then(function(response){
                if(loopOption && loopOption.pending && loopOption.pending(response)){
                    setTimeout(()=>fetch(), interval);
                    return false;
                }
                let res = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                // 预处理 追加 message 字段
                res.message = res.errcode !== 0 ? res.data[0].result.desc : '';
                console.log("debug:", directive, res);
                return resolve(res);
            })
            .catch( error => {
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
                if(loopOption.handleError){
                    Modal.error({ title : 'Error', content : <Error error={error} directive={directive} />});
                }
                return reject(error);
            })
        }
        fetch();
    })
    
    return promise;
};


function Error(props){
    return (
        <div>
            <div>{props.error.message}</div>
            <span className="ui-tips">({props.directive})</span>
        </div>
    )
}


// export const TIMEZONES = TIMEZONE;;
// export const timersManager = timersManager;





