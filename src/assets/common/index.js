

import Loadable from 'react-loadable';
import axios from 'axios';
import { stringify } from 'qs';

const { assign } = Object;
const noop = ()=>{};

export const asyncImport = component => {
    return Loadable({
        loader : () => import(component),
        loading : "Loading" 
    });
};

export function fetch(url, params){
    let conf  = { method : 'GET', timeout : 10 * 1000, responseType : 'json' };
    if(!url){
       alert('Request url is required'); 
       return;
    }
    let options = assign(conf, params);
    let method = params.method.toLowerCase();
    
    if(method === 'get'){
        options.params = {"params" : options.data || options.params || {}};
    }
    else if(method === 'post'){
        // options.headers = {
        //     "Content-Type" : "application/x-www-form-urlencoded:charset=UTF-8",
        //     ...options.headers
        // };
        options.data = {"params" : options.data || options.params || {}};
        options.data = stringify(options.data, {encodeValuesOnly : true});
    }
    return axios(url, options).catch( error => {
        console.error("axios catch : ", error);
    })
}





