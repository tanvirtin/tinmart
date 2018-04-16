// will contain all possible redux actions related to the product view

// import the all the types of action that these action creators will create
import {
    PRODUCT_LOADING_ON,
    PRODUCT_LOADING_OFF,
    REMOVE_PRODUCT,
    ADD_CART_ITEM,
    VIEW_PRODUCT
} from '../constants/actionTypes';

// import the get action creator from the ajaxRequests file
import { 
    get,
    put
 } from './ajaxRequests';

// action creator that invokes the reducer to turn loading spinner on
export const loadingOn = () => ({
    type: PRODUCT_LOADING_ON
});

// action creator that invokes the reducer to turn loading spinner off
export const loadingOff = () => ({
    type: PRODUCT_LOADING_OFF
});

export const removeProduct = () => ({
    type: REMOVE_PRODUCT
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

export const getProduct = productId => get('products/' + productId, {
    // same thing as writing {loadingOn: loadingOn, loadingOff: loadingOff}
    loadingOn,
    loadingOff
});

export const getRecommendations = (productId) => get('products/suggest/' + productId, {
    loadingOn,
    loadingOff
})

export const viewProduct = product => ({
    type: VIEW_PRODUCT,
    product
});

// a redux thunk function will call viewProduct action and then execute a callBack after calling viewProduct function
// the callBack is from the component environment to the thunk to execute
export const refresh = (productId, callBack) => {
    return (dispatch, getState) => {
        const currentState = getState();
        dispatch(viewProduct(productId));
        callBack();
    }
}