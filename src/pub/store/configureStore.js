
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from '../reducers';
import thunk from 'redux-thunk';


const composeEnhance = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function(reploadState, middleWare = [thunk]){
    return createStore(reducer, reploadState, composeEnhance(
        applyMiddleware(...middleWare)
    ));
}




