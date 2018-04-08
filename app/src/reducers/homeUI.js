// reducer containing all the UI states for the home view, these states dictate the UI change rendering for the home

import {
    HOME_LOADING_ON,
    HOME_LOADING_OFF
} from '../constants/actionTypes';

// This object will contain all the default states for the Home view's user interace.
const initialState = {
    loading: false
}

export default (state = initialState, action) => {
    switch(action.type) {
        // copy over the original state using deep copy and then change the loading attribute to true
        case HOME_LOADING_ON:
            return {...state, loading: true};
        // copy over the original state using deep copy and then change the loading attribute to false        
        case HOME_LOADING_OFF:
            return {...state, loading: false};
        
        // by default the unchanged current state is returned
        default:
            return state;
    }
}