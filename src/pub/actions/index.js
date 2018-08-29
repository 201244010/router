

import * as types from '../types';

export function updateUserInfo(user){
    return {
        type : types.UPDATE_USER_INFO,
        payload : user
    };
}





