

import Loadable from 'react-loadable';

const asyncImport = component => {
    return Loadable({
        loader : () => import(component),
        loading : "Loading" 
    });
};

export default {
    asyncImport
};
  

