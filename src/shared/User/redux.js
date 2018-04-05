import ApiCall from '../utils/rest';


/* *************** Reducers *************** */

function userReducer(state = {
    loading: false,
    data: {},
    error: null,
}, action) {
    switch (action.type) {
    case 'GET_USER_REQUEST':
        return { ...state, loading: true };
    case 'GET_USER_SUCCESS':
        return { ...state, loading: false, data: action.payload };
    case 'GET_USER_FAILURE':
        return { ...state, loading: false, };
    default:
        return state;
    }
}

/* *************** Selectors *************** */

const Selectors = {
    getUser: state => state.user.data,
};

/* *************** Actions *************** */

function getUserRequest() {
    return { type: 'GET_USER_REQUEST' };
}

function getUserSuccess(data) {
    return { type: 'GET_USER_SUCCESS', payload: data };
}

function getUserFailure(error) {
    return { type: 'GET_USER_REQUEST', payload: error };
}

const getUser = id => async (dispatch) => {
    try {
        dispatch(getUserRequest());
        const response = await ApiCall(`/users/${id}`).get();
        dispatch(getUserSuccess(response.data));
    } catch (error) {
        dispatch(getUserFailure());
    }
};

const Actions = {
    getUser,
};

export default userReducer;

export { Actions, Selectors };
