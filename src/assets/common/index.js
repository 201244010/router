

import Loadable from 'react-loadable';

export const asyncImport = component => {
    return Loadable({
        loader : () => import(component),
        loading : "Loading" 
    });
};



