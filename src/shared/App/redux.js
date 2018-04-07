import { combineReducers } from 'redux';

/* *************** Actions *************** */

function toggleActions() {
    return { type: 'TOGGLE_ACTIONS' };
}

const Actions = {
    toggleActions,
};

/* *************** Reducers *************** */

function navbarReducer(state = {
    actionsVisible: false
}, action) {

    if (action.type === 'TOGGLE_ACTIONS') {
        return { actionsVisible: !state.actionsVisible };
    } 

    return state;
}

const rootReducer = combineReducers({
    navbar: navbarReducer,
});

/* *************** Selectors *************** */

const Selectors = {
    avtionsVisible: state => state.app.navbar.actionsVisible,
};

export default rootReducer;

export { Actions, Selectors };
