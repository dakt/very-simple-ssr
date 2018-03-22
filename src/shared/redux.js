import { createStore } from 'redux';

function rootReducer(state = {
    loading: false,
    data: []
}, action) {

    switch (action.type) {
        case 'GET_GIST_REQUEST':
            return { loading: true, };
        case 'GET_GIST_SUCCESS':
            return { loading: false, data: action.payload };
        case 'GET_GIST_FAILURE':
            return { loading: false, };
        default:
            return state;
    }
}

export function configureStore() {
    const store = createStore(rootReducer);
    return store;
}
