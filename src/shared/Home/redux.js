import { combineReducers } from 'redux';
import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';

import ApiCall from '../utils/rest';

/* *************** Reducers *************** */

function dataReducer(state = {
    loading: false,
    byId: {},
    ids: [],
}, action) {

    switch (action.type) {
    case 'LOAD_MORE_REQUEST':
        return {
            ...state,
            loading: true,
        }
    case 'LOAD_MORE_SUCCESS':
        return {
            loading: false,
            byId: { ...state.byId, ...action.payload.byId},
            ids: [...state.ids, ...action.payload.ids],
        };
    case 'LOAD_MORE_FAILURE':
        return state;
    default:
        return state;
    }
}

function paginationReducer(state = {
    page: null,
    limit: 20,
    count: 0,
}, action) {

    if (action.type === 'LOAD_MORE_SUCCESS') {
        return action.payload.pagination;
    }

    return state;
}

function checkedReducer(state = [], action) {

    if (action.type === 'ENTITY_CHECK') {
        return state.includes(action.payload.id) 
            ? state.filter(id => id !== action.payload.id)
            : [...state, action.payload.id];
    }

    return state;
}

/* *************** Selectors *************** */

const getUsers = createSelector(
    [state => state.entities.data.byId, state => state.entities.data.ids],
    (byId, ids) => ids.map(id => byId[id])
);

const Selectors = {
    getUsers,
    getPagination: state => state.entities.pagination,
    isChecked: (state, id) => state.entities.checked.includes(id),
};

/* *************** Actions *************** */

function loadMoreRequest() {
    return { type: 'LOAD_MORE_REQUEST' };
}

function loadMoreSuccess(data, page, limit, count) {

    const users = new schema.Entity('users');
    const normalizedData = normalize(data, [users]);

    const byId = normalizedData.entities.users;
    const ids = normalizedData.result;

    return {
        type: 'LOAD_MORE_SUCCESS',
        payload: { byId, ids, pagination: { page, limit, count } },
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
    const state = getState();
    let { page, limit, count } = Selectors.getPagination(state);

    // If page is null it is a initial request done by the server
    page = page === null ? 1 : page + 1;

    if (page !== 1 && page * limit > count) {
        dispatch(noMore());
        return;
    }

    try {
        dispatch(loadMoreRequest());
        const response = await ApiCall(`/users?page=${page}&limit=${limit}`).get();
        dispatch(loadMoreSuccess(response.data, page, limit, response.count));
    } catch (error) {
        dispatch(loadMoreFailure(error));
        console.error(error);
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

export default combineReducers({
    data: dataReducer,
    pagination: paginationReducer,
    checked: checkedReducer,
});

export { Actions, Selectors };
