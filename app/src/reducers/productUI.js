// reducer containing all the UI states for the PRODUCT view, these states dictate the UI changes

import {
    PRODUCT_LOADING_ON,
    PRODUCT_LOADING_OFF,
    VIEW_PRODUCT,
    REMOVE_PRODUCT,
} from '../constants/actionTypes';

// This object will contain all the default states for the PRODUCT view's user interface
const initialState = {
    loading: false,
    productCurrentlyViewed: ''
}

export default (state = initialState, action) => {
    switch(action.type) {
        // copy over the original state using deep copy and then change the loading attribute to true
        case PRODUCT_LOADING_ON:
            return {...state, loading: true};

        // copy over the original state using deep copy and then change the loading attribute to false
        case PRODUCT_LOADING_OFF:
            return {...state, loading: false};

        case VIEW_PRODUCT:
            return {...state, productCurrentlyViewed: action.product};

        case REMOVE_PRODUCT:
            return initialState;

        // by default the unchanged current state is returned
        default:
            return state;
    }
}