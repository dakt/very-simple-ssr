import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { matchPath } from 'react-router';
import thunk from 'redux-thunk';
import qs from 'query-string';

import entitiesReducer from './Home/redux';
import userReducer from './User/redux';
import appReducer from './App/Navbar/redux';

function findRoute(routes, path) {
    return routes.reduce((acc, route) => {
        const found = matchPath(path, route);
        return found ? { ...route, ...found } : acc;
    }, null);
}

function routeReducer(state = {}, action) {
    if (action.type === 'ROUTE_CHANGED') {
        return action.payload;
    }

    return state;
}

const rootReducer = combineReducers({
    route: routeReducer,
    entities: entitiesReducer,
    user: userReducer,
    app: appReducer,
});

function isClient() {
    return typeof window !== 'undefined' && window.document;
}

function configureStore(history, routes) {
    const composeEnhancers = isClient()
        ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)
        : compose;

    const middlewares = [thunk];

    const initialState = isClient() ? window.__INITIAL_STATE__ : {};

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(...middlewares)),
    );

    history.listen((location) => {
        const match = findRoute(routes, history.location.pathname);

        store.dispatch({
            type: 'ROUTE_CHANGED',
            payload: {
                ...location,
                params: match.params,
                qs: qs.parse(location.search),
            },
        });
    });

    const match = findRoute(routes, history.location.pathname);

    // Initial route change
    store.dispatch({
        type: 'ROUTE_CHANGED',
        payload: {
            ...history.location,
            params: match.params,
            qs: qs.parse(history.location.search),
            type: 'SERVER',
        },
    });

    return store;
}

export { configureStore };

