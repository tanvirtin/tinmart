// reducer containing all the UI states for the login view

import {
    LOGIN_LOADING_ON,
    LOGIN_LOADING_OFF,
    AUTHENTICATION_ERROR,
    CLEAR_USERNAME_RED_BORDER,
    CLEAR_PASSWORD_RED_BORDER,
    NO_USERNAME_LOGIN,
    NO_PASSWORD_LOGIN,
    CLEAR_LOGIN_UI_CHANGES
} from '../constants/actionTypes';


// This object will contain all the default states for the Login view's user interface.
const initialState = {
    loading: false,
    userNameFieldBorder: '#dddddd',
    passwordFieldBorder: '#dddddd',
}

export default (state = initialState, action) => {
    switch (action.type) {

        // copy over the original state using deep copy and then change the loading attribute to false
        case LOGIN_LOADING_ON:
            return {...state, loading: true};

        case LOGIN_LOADING_OFF:
            return {...state, loading: false};

        case AUTHENTICATION_ERROR:
            return {
                ...state,
                userNameFieldBorder: action.userNameFieldBorder,
                passwordFieldBorder: action.passwordFieldBorder
            };

        case CLEAR_USERNAME_RED_BORDER:
            return {...state, userNameFieldBorder: action.userNameFieldBorder};

        case CLEAR_PASSWORD_RED_BORDER:
            return {...state, passwordFieldBorder: action.passwordFieldBorder};

        case NO_USERNAME_LOGIN:
            return {...state, userNameFieldBorder: action.userNameFieldBorder};

        case NO_PASSWORD_LOGIN:
            return {...state, passwordFieldBorder: action.passwordFieldBorder};

        case CLEAR_LOGIN_UI_CHANGES:
            // deep copy the initial state into another object and return that object
            return {...initialState};

        // by default the unchanged current state is returned
        default:
            return state;
    }
}
