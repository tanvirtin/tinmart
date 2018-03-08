// will contain all possible redux actions related to the login view

import {
    LOGIN_LOADING_ON,
    LOGIN_LOADING_OFF,
    SET_USERNAME_LOGIN,
    SET_PASSWORD_LOGIN,
    AUTHENTICATION_ERROR,
    CLEAR_USERNAME_RED_BORDER,
    CLEAR_PASSWORD_RED_BORDER,
    NO_USERNAME_LOGIN,
    NO_PASSWORD_LOGIN,
    CLEAR_LOGIN_FORM,
    CLEAR_LOGIN_UI_CHANGES,
    AUTHENTICATION_COMPLETE
} from '../constants/actionTypes'

import { post } from './ajaxRequests';

export const loadingOn = () => ({
    type: LOGIN_LOADING_ON
});


export const loadingOff = () => ({
    type: LOGIN_LOADING_OFF
});

export const setUserName = (userName) => ({
    type: SET_USERNAME_LOGIN,
    // instead of userName: userName, I am using the ES6 syntax
    userName
});

export const setPassword = (password) => ({
    type: SET_PASSWORD_LOGIN,
    password
});

export const authenticationError = () => ({
    type: AUTHENTICATION_ERROR,
    userNameFieldBorder: 'red',
    passwordFieldBorder: 'red'
});

export const clearUserNameRedBorder = () => ({
    type: CLEAR_USERNAME_RED_BORDER,
    userNameFieldBorder: '#dddddd'
});

export const clearPasswordRedBorder = () => ({
    type: CLEAR_PASSWORD_RED_BORDER,
    passwordFieldBorder: '#dddddd'
});

export const noUserName = () => ({
    type: NO_USERNAME_LOGIN,
    userNameFieldBorder: 'red'
});

export const noPassword = () => ({
    type: NO_PASSWORD_LOGIN,
    passwordFieldBorder: 'red'
});

export const clearLoginForm = () => ({
    type: CLEAR_LOGIN_FORM
});

// this action creator creates an action that has no payload
export const clearLoginUIChanges = () => ({
    type: CLEAR_LOGIN_UI_CHANGES
});

// using a single line arrow function will automatically invoke the keyword return which returns a promise returned by the post function
export const postLoginForm = loginForm => post('accounts/authenticate-user', loginForm, {
    loadingOn,
    loadingOff
});

// this action creator will create an action which will turn the boolean in loginStatus reducer called loggedIn to true and set the authentication token
export const authenticationComplete = authToken => ({
    type: AUTHENTICATION_COMPLETE,
    loggedIn: true,
    // same thing as writing authToken: authToken
    authToken
});
