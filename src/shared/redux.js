import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import qs from 'query-string';


function gistReducer(state = {
    loading: false,
    data: [],
    pagination: {
        page: 1,
        count: 0,
        limit: 10,
    }
}, action) {

    switch (action.type) {
        case 'GET_DATA_REQUEST':
            return { ...state, loading: true, };
        case 'GET_DATA_SUCCESS':
            return { 
                ...state,
                loading: false,
                data: action.payload.data,
                pagination: action.payload.pagination,
            };
        case 'GET_DATA_FAILURE':
            return { ...state, loading: false, };
        default:
            return state;
    }
}

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
