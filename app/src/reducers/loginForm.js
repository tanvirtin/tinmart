// reducer state will contain the login form data that will be sent to the server

import {
    SET_USERNAME_LOGIN,
    SET_PASSWORD_LOGIN,
    CLEAR_LOGIN_FORM
} from '../constants/actionTypes';


// this object will represent the login form data
const initialState = {
    userName: '',
    password: ''
}


export default (state = initialState, action) => {
    switch (action.type) {

        // copy over the original state using deep copy and then change the userName attribute to the userName attribute of the action object
        case SET_USERNAME_LOGIN:
            return {...state, userName: action.userName};

        case SET_PASSWORD_LOGIN:
            return {...state, password: action.password};

        // This case gets called when the authentication complets and we no longer need to store the loginForm in the Redux store.
        case CLEAR_LOGIN_FORM:
            // just return the initialState of the reducer
            return initialState;

        // by default the unchanged state is returned
        default:
            return state;
    }
}
