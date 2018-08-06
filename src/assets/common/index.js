

import Loadable from 'react-loadable';
import axios from 'axios';
// import { stringify } from 'qs';

const { keys, values, assign } = Object;
const noop = ()=>{};

export const asyncImport = component => {
    return Loadable({
        loader : () => import(component),
        loading : "Loading" 
    });
};

export const fetcher = function( url = "", params = {} ) {
    return function (callback = noop) {
        const defaults = { method : "get", url, timeout : 30 * 1000};
        const conf = assign({}, defaults, params);
        // if(conf.method != "get"){
        //     conf.transformRequest = function(data){
        //         return stringify(data);
        //     };
        // }
        return axios(conf).then(resp => callback === noop ? resp : callback(resp))
    };
}






