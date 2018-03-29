import ApiCall from '../utils/rest';

/* *************** Reducers *************** */

const INITIAL_STATE = {
    loading: false,
    data: [],
    checked: [],
    pagination: {
        page: 1,
        count: 0,
        limit: 20,
    },
};

function entitiesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
    case 'LOAD_MORE_REQUEST':
    case 'GET_ENTITIES_REQUEST': {
        return {
            ...state,
            loading: true,
        };
    }

    case 'GET_ENTITIES_SUCCESS':
        return {
            ...state,
            loading: false,
            data: action.payload.data,
            pagination: action.payload.pagination,
        };

    case 'LOAD_MORE_FAILURE':
    case 'GET_ENTITIES_FAILURE': {
        return { ...state, loading: false };
    }

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

function getEntitiesRequest() {
    return { type: 'GET_ENTITIES_REQUEST' };
}

function getEntitiesSuccess(payload) {
    return { type: 'GET_ENTITIES_SUCCESS', payload };
}

function getEntitiesFailure(error) {
    return { type: 'GET_ENTITIES_FAILURE', error };
}

function loadMoreRequest() {
    return { type: 'LOAD_MORE_REQUEST' };
}

function loadMoreSuccess(payload) {
    return { type: 'LOAD_MORE_SUCCESS', payload };
}

function loadMoreFailure(error) {
    return { type: 'LOAD_MORE_FAILURE', error };
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
    const { page, limit } = store.entities.pagination;
    const nextPage = page + 1;

    dispatch(loadMoreRequest());

    try {
        const response = await ApiCall(`/users?page=${nextPage}&limit=${limit}`).get();
        const { data, count } = response;
        const payload = {
            data,
            pagination: { page: nextPage, limit, count },
        };

        dispatch(loadMoreSuccess(payload));
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
    getEntitiesRequest,
    getEntitiesSuccess,
    getEntitiesFailure,
    deleteEntity,
    entityCheck,
    loadMore,
};

export default entitiesReducer;
export { Actions };
