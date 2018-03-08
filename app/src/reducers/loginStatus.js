// reducer state will contain the login status which is a boolean indicating whether the user is logged in or not and their authentication token

import {
    AUTHENTICATION_COMPLETE
} from '../constants/actionTypes';

const initialState = {
    loggedIn: false,
    authToken: ''
}

export default (state = initialState, action) => {
    switch(action.type) {
        case AUTHENTICATION_COMPLETE:
            // deep copy the current state object and then change the loggedIn and authToken attribute to the two attribute provided in the action object
            return {...state, loggedIn: action.loggedIn, authToken: action.authToken};

        // by default the state is always returned if none of the conditions above match
        default:
            return state;
    }
}
