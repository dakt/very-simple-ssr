import { createStore, applyMiddleware, compose, combineReducers } from 'redux';


function gistReducer(state = {
    loading: false,
    data: []
}, action) {

    switch (action.type) {
        case 'GET_GIST_REQUEST':
            return { ...state, loading: true, };
        case 'GET_GIST_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'GET_GIST_FAILURE':
            return { ...state, loading: false, };
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    gist: gistReducer,
});

function isClient() {
    return typeof window !== "undefined" && window.document;
}

export function configureStore() {

    const composeEnhancers = isClient() ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;

    const middlewares = [];

    const initialState = isClient() ? window.__INITIAL_STATE__ : {};

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(
            applyMiddleware(...middlewares)
        )
    );

    return store;
}
