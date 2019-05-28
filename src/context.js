
import React from 'react';

const userInfo = { 
    logined : false    
};

const UserInfoContext = React.createContext(userInfo);

const UpgradeContext = React.createContext();

const RebootContext = React.createContext();

const RecoveryContext = React.createContext();

export {UserInfoContext, UpgradeContext, RebootContext, RecoveryContext};



