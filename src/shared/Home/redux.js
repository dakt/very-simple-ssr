import { combineReducers } from 'redux';

import ApiCall from '../utils/rest';

/* *************** Reducers *************** */

const INITIAL_STATE = {
    loading: false,
    data: [],
    checked: [],
    pagination: {
        /*
         * Null will be replaced by "1" after the server
         * completes initial request
         */
        page: null,
        count: 0,
        limit: 20,
    },
};

function entitiesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
    case 'LOAD_MORE_REQUEST':
        return {
            ...state,
            loading: true,
        };

    case 'LOAD_MORE_SUCCESS':
        return {
            ...state,
            loading: false,
            data: [...state.data, ...action.payload.data],
            pagination: action.payload.pagination,
        };

    case 'LOAD_MORE_FAILURE':
        return { ...state, loading: false };

    case 'ENTITY_CHECK':
        return {
            ...state,
            checked: (
                state.checked.includes(action.payload.id)
                    ? state.checked.filter(id => id !== action.payload.id)
                    : [...state.checked, action.payload.id]
            ),
        };

    case 'ENTITY_DELETE_SUCCESS':
        return {
            ...state,
            data: state.data.filter(d => d.id !== action.payload.id),
            checked: state.checked.filter(id => id !== action.payload.id),
        };

    default:
        return state;
    }
}

function dataReducer(state = {
    loading: false,
    byId: {},
    ids: [],
}, action) {

    if (action.type === 'LOAD_MORE_SUCCESS') {
        return {
            ...state,
            ids: action.payload.data,
        };
    }

    return state;
}

function paginationReducer(state = {
    page: null,
    limit: 10,
    count: 0,
}, action) {

    if (action.type === 'LOAD_MORE_SUCCESS') {
        return state;
    }

    return state;
}

function checkedReducer(state = [], action) {

    if (action.type === 'ENTITY_CHECK') {
        return state;
    }

    return state;
}


export default combineReducers({
    data: dataReducer,
    pagination: paginationReducer,
    checked: checkedReducer,
});


const Selectors = {
    getUsers: state => state.entities.data.ids,
    getPagination: state => state.entities.pagination,
    getChecked: state => state.entities.checked,
};

/* *************** Actions *************** */

function loadMoreRequest() {
    return { type: 'LOAD_MORE_REQUEST' };
}

function loadMoreSuccess(data, page, limit, count) {
    return {
        type: 'LOAD_MORE_SUCCESS',
        payload: { data, pagination: { page, limit, count } },
    };
}

function loadMoreFailure(error) {
    return { type: 'LOAD_MORE_FAILURE', error };
}

function noMore() {
    return { type: 'NO_MORE' };
}

function deleteEntityRequest() {
    return { type: 'DELETE_ENTITIY_REQUEST' };
}

function deleteEntitySuccess() {
    return { type: 'DELETE_ENTITIY_SUCCESS' };
}

function deleteEntityFailure() {
    return { type: 'DELETE_ENTITIY_FAILURE' };
}

function entityCheck(id) {
    return { type: 'ENTITY_CHECK', payload: { id } };
}

const loadMore = () => async (dispatch, getState) => {
    const store = getState();
    let { page, limit, count } = store.entities.pagination;

    // If page is null it is a initial request done by the server
    page = page === null ? 1 : page + 1;

    if (page !== 1 && page * limit > count) {
        dispatch(noMore());
        return;
    }

    try {
        dispatch(loadMoreRequest());
        const response = await ApiCall(`/users?page=${page}&limit=${limit}`).get();
        const { data, count } = response;

        dispatch(loadMoreSuccess(data, page, limit, count));
    } catch (error) {
        dispatch(loadMoreFailure(error));
    }
};

const deleteEntity = id => async (dispatch) => {
    dispatch(deleteEntityRequest());

    try {
        await ApiCall(`/users/${id}`).remove();
        dispatch(deleteEntitySuccess());
    } catch (error) {
        dispatch(deleteEntityFailure(error));
    }
};

const Actions = {
    deleteEntity,
    entityCheck,
    loadMore,
};

//export default entitiesReducer;
export { Actions, Selectors };
