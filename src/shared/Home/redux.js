
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
        case 'GIST_CHECK':
            return { 
                ...state,
                checked: (
                    state.checked.includes(action.payload.id) 
                        ? state.checked.filter(id => id !== action.payload.id)
                        : [...state.checked, action.payload.id]
                ),
            };
        default:
            return state;
    }
}


export default gistReducer;