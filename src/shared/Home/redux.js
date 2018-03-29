
/* *************** Reducers *************** */

const INITIAL_STATE = {
    loading: false,
    data: [],
    checked: [],
    pagination: {
        page: 1,
        count: 0,
        limit: 10,
    },
};

function gistReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
    case 'GET_DATA_REQUEST':
        return { ...state, loading: true };
    case 'GET_DATA_SUCCESS':
        return {
            ...state,
            loading: false,
            data: action.payload.data,
            pagination: action.payload.pagination,
        };
    case 'GET_DATA_FAILURE':
        return { ...state, loading: false };
    case 'LOAD_MORE_SUCCESS':
        return {
            ...state,
            data: [...state.data, ...action.payload.data],
            pagination: action.payload.pagination,
        };
    case 'GIST_CHECK':
        return {
            ...state,
            checked: (
                state.checked.includes(action.payload.id)
                    ? state.checked.filter(id => id !== action.payload.id)
                    : [...state.checked, action.payload.id]
            ),
        };
    case 'GIST_DELETE_SUCCESS':
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

const loadMore = () => async (dispatch, getState) => {
    const store = getState();
    const { page, limit } = store.gist.pagination;
    const nextPage = page + 1;
    const url = `http://localhost:3000/api/users?page=${nextPage}&limit=${limit}`;

    dispatch({ type: 'LOAD_MORE_REQUEST' });

    try {
        const response = await fetch(url);
        const count = response.headers.get('x-total-count');
        const payload = {
            data: await response.json(),
            pagination: { page: nextPage, limit, count },
        };

        dispatch({ type: 'LOAD_MORE_SUCCESS', payload });
    } catch (error) {
        dispatch({ type: 'LOAD_MORE_FAILURE' });
    }
};


const Actions = {
    loadMore,
};

export default gistReducer;
export { Actions };
