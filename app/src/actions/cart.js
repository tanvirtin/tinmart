// will contain all possible redux actions related to the cart view

// import the all the types of action that these action creators will create
import {
    CART_LOADING_ON,
    CART_LOADING_OFF,
    SHOW_CART_CARDS
} from '../constants/actionTypes';

// import the get action creator from the ajaxRequests file
import { get } from './ajaxRequests';

// action creator that invokes the reducer to turn loading spinner on
export const loadingOn = () => ({
    type: CART_LOADING_ON
});

// action creator that invokes the reducer to turn loading spinner off
export const loadingOff = () => ({
    type: CART_LOADING_OFF
});

// get the product with the product id
export const getProduct = productId => get('products/' + productId, {
    // same thing as writing {loadingOn, loadingOn, loadingOff: loadingOff}
    loadingOn,
    loadingOff
});

// show the cards
export const showCards = () => ({
    type: SHOW_CART_CARDS
})