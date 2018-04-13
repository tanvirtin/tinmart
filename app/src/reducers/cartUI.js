// reducer containing all the UI states for the cart view, these states dictate the UI changes

import {
    CART_LOADING_ON,
    CART_LOADING_OFF,
    SHOW_CART_CARDS,
    HIDE_CART_CARDS
} from '../constants/actionTypes';

// This object will contain all the default states for the Cart view's user interface
const initialState = {
    loading: false,
    showCards: false
}

export default (state = initialState, action) => {
    switch(action.type) {
        // copy over the original state using deep copy and then change the loading attribute to true
        case CART_LOADING_ON:
            return {...state, loading: true};

        // copy over the original state using deep copy and then change the loading attribute to false
        case CART_LOADING_OFF:
            return {...state, loading: false};

        // copy over the original state using deep copy and then change the showCards attribute to false
        case SHOW_CART_CARDS:
            return {...state, showCards: true};

        // copy over the original state using deep copy and then change the showCards attribute to false
        case HIDE_CART_CARDS:
            return {...state, showCards: false};

        // by default the unchanged current state is returned
        default:
            return state;
    }
}