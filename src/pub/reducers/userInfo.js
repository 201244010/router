

import * as types from '../types';

export default (state = {}, action) => {
    switch(action.type){
        case types.UPDATE_USER_INFO : 
            return action.payload;
        default :
            return state;
    }
};