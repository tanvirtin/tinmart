// will contain all possible redux actions related to the home view

// import the all the types of action that these action creators will create
import {
    HOME_LOADING_ON,
    HOME_LOADING_OFF,
    STORE_TERM,
    CLEAR_TERM,
    NO_PRODUCT_FOUND,
    PRODUCT_FOUND,
    ADD_CART_ITEM
} from '../constants/actionTypes';

// import the get action creator from the ajaxRequests file
import { get } from './ajaxRequests';

// action creator that invokes the reducer to turn loading spinner on
export const loadingOn = () => ({
    type: HOME_LOADING_ON
});

// action creator that invokes the reducer to turn loading spinner off
export const loadingOff = () => ({
    type: HOME_LOADING_OFF
});

// using a single line arrow function will automatically invoke the keyword return which returns a promise returned by the post function
// so what happens is that post procedure gets invoked when this action is called and a promise is returned
export const submitSearch = term => get('search/' + term, {
    // same thing as writing {loadingOn: loadingOn, loadingOff: loadingOff}
    loadingOn,
    loadingOff
});

// action creator takes term through its parameter and creates an object which contains the term and the type of action
export const storeTerm = term => ({
    type: STORE_TERM,
    term
});

// action creator creates an action object with type 'CLEAR_TERM'
export const clearTerm = () => ({
    type: CLEAR_TERM
});

export const noProductFound = () => ({
    type: NO_PRODUCT_FOUND
});

export const productFound = () => ({
    type: PRODUCT_FOUND
});

/**
 * Adds a product to the reducer's state's product attribute array, the action is a debounced action meaning the same action won't be invoked until the other action has been resolved
 * @param product the product id string that gets added to the products array saved in the redux store's state attribute which is cartItems 
 */
export const addCartItem = product => ({
    type: ADD_CART_ITEM,
    product,
    meta: {
        debounce: {
            time: 400
        }
    }
});