

import Loadable from 'react-loadable';
import {DIRECTIVE} from './constants';
import axios from 'axios';
import { stringify } from 'qs';

const { assign } = Object;
const noop = () => {};

export const asyncImport = component => {
    return Loadable({
        loader : () => import(component),
        loading : "Loading" 
    });
};

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
        console.error("axios catch : ", error);
    })
}





