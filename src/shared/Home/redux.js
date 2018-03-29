import ApiCall from '../utils/rest';
import { debug } from 'util';

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
    case 'GET_ENTITIES_REQUEST':
        return {
            ...state,
            loading: true,
        };

    case 'GET_ENTITIES_SUCCESS':
        return {
            ...state,
            loading: false,
            data: action.payload.data,
            pagination: action.payload.pagination,
        };

    case 'LOAD_MORE_FAILURE':
        return { ...state, loading: false };

    case 'LOAD_MORE_SUCCESS':
        return {
            ...state,
            loading: false,
            data: [...state.data, ...action.payload.data],
            pagination: action.payload.pagination,
        };

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

export default entitiesReducer;
export { Actions };
