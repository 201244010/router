import Loadable from 'react-loadable';
import {DIRECTIVE, ERROR_MESSAGE} from './constants';
import axios from 'axios';
import {message} from 'antd';
import React from 'react';
import loading from '~/components/Loading';
import {stringify} from 'qs';
import { get, clear } from '~/assets/common/auth';

const MODULE = 'common';

const {assign} = Object;
const noop = () => {
};

/**
 * 异步加载组件
 * @param {component} component
 */
export const asyncImport = component => {
    return Loadable({
        loader: () => import(component),
        loading: "Loading"
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
 * @param {string} data 指令和指令参数
 * @param {object} options axios配置
 * @param {object} loopOption 扩展配置
 *               loopOption.loop [boolean]是否循环 或循环 N 次,
 *               loopOption.interval [number]] 轮询间隔 ms
 *               loopOption.stop [function] 轮询终止的条件
 *               loopOption.pending [function] 已经成功响应，仍需继续轮询的条件
 * @see
 * fetchApi(
 *      [{
 *          opcode : 'ACCOUNT_LOGIN', 
 *          data : {password : '123'}
 *      }],
 *      {timeout : 10000},
 * );
 * fetchApi(
 *      [
 *          {opcode : 'DHCPS_GET'},
 *          {opcode : 'NETWORK_LAN_IPV4_GET'}
 *      ],
 *      {timeout : 10000},
 *      {loop : true, interval : 1000, stop : function(){return true}},
 *
 * );
 */
export function fetchApi(data, options = {}, loopOption = {}) {
    data = Object.prototype.toString.call(data) === "[object Array]" ? data : [data];
    options = assign({ timeout: 10000, method: 'POST', loading: false, ignoreErr: false }, options);

    let url = __BASEAPI__ + '/';
    let {loop, interval} = assign({loop: false, interval: 1000, pending: noop}, loopOption);

    let payload = data.map(item => {
        return {
            opcode: DIRECTIVE[item.opcode],
            param: item.data || {},
        }
    });

    let count = 1, method = options.method.toLowerCase();
    if (method === 'get') {
        options.params = {"params": payload, count: "1"};
    }
    else if (method === 'post') {
        options.data = {"params": payload, count: "1"};
    }

    const stok = get();
    if (stok) {
        //const cookie = `sysauth=${stok}; stok=${stok}`;
        options.headers = {
            //Cookie: cookie,   // 直接设置Cookie axios不生效，也不合理，改用自定义Header XSRF-TOKEN
            ['XSRF-TOKEN']: stok,
        };
    }

    if (loopOption.loop && typeof loopOption.stop !== 'function') {
        throw new Error('loopOption.stop must be function, because loopOption.loop is active');
    }
    const promise = new Promise((resolve, reject) => {
        function fetch() {
            options.loading && loading.show();

            return axios(url, options).then(function (response) {
                options.loading && loading.close();

                // 请求响应 但是响应的数据集为空
                if (response.data === '') {
                    return resolve({errcode: 0});
                }
                // 正常响应 解析响应结果
                if (options.fileLink === true) {
                    try{
                        let blob = new Blob([response.data], {type: 'application/x-targz'});
                        const fileName = response.headers["content-disposition"].match(/\"(.*)\"/)[1];
                        if(window.navigator.msSaveBlob){
                            // for ie 10 and later
                            window.navigator.msSaveBlob(blob, fileName);
                        } else {
                            let link = document.createElement('a');
                            document.body.appendChild(link);
                            link.style.display = 'none';
                            link.href = URL.createObjectURL(blob);
                            console.log(response.headers);
                            link.download = fileName;
                            link.click();
                            setTimeout(function () {
                                document.body.removeChild(link)
                            }, 1000);
                            window.URL.revokeObjectURL(link.href);
                        }
                    } catch(e) {
                        console.error(e);
                    }
                    return;
                }
                let res = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                if (res.errcode !== 0) {
                    // 预处理 追加 message 字段
                    res.message = ERROR_MESSAGE[res.errcode] || res.errcode;
                }

                if (loopOption && loopOption.pending && loopOption.pending(res)) {
                    setTimeout(() => fetch(), interval);
                    return false;
                }

                return resolve(res);
            }).catch(error => {
                options.loading && loading.close();

                switch (typeof loop) {
                    case 'number':
                        if (count < loop) {
                            count++;
                            if (!loopOption.stop()) {
                                setTimeout(() => fetch(), interval);
                            }
                            return false;
                        }
                        break;
                    case 'boolean':
                        if (loop === true) {
                            if (!loopOption.stop()) {
                                setTimeout(() => fetch(), interval);
                            }
                            return false;
                        }
                        break;
                    case 'string':
                        throw new Error('fetchApi 要求循环参数为 boolean 或 number');
                }

                if (error.toString().indexOf('403') > -1) {
                    clear();
                    const login = '/login';
                    if (location.pathname.indexOf(login) === -1) {
                        location.href = login;
                    }
                    return reject({});
                }

                if (error.toString().indexOf('Network Error') > -1 && !options.ignoreErr) {
                    message.error(intl.get(MODULE, 0));
                }

                return reject(error);
            })
        }

        fetch();
    });

    return promise;
}

// export const TIMEZONES = TIMEZONE;;
// export const timersManager = timersManager;

export const mockResponse = function (data) {
    return {
        errcode: 0,
        data: [{
            result: data
        }],
        message: 'success'
    };
};
