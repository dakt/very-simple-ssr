import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import qs from 'query-string';

import gistReducer from './Home/redux';


function routeReducer(state = {}, action) {
    if (action.type === 'ROUTE_CHANGED') {
        return action.payload;
    }

    return state;
}

const rootReducer = combineReducers({
    route: routeReducer,
    gist: gistReducer,
});

function isClient() {
    return typeof window !== "undefined" && window.document;
}

export function configureStore(history) {

    const composeEnhancers = isClient() ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;

    const middlewares = [];

    const initialState = isClient() ? window.__INITIAL_STATE__ : {};

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(
            applyMiddleware(...middlewares),
        )
    );

    history.listen((location, action) => {
        store.dispatch({
            type: 'ROUTE_CHANGED',
            payload: {
                ...location,
                qs: qs.parse(location.search),
            },
        });
    });

    // Initial route change
    store.dispatch({
        type: 'ROUTE_CHANGED',
        payload: {
            ...history.location,
            qs: qs.parse(history.location.search),
            type: 'SERVER',
        }
    });

    return store;
}
