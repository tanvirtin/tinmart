// will contain all possible redux actions related to the product view

// import the all the types of action that these action creators will create
import {
    PRODUCT_LOADING_ON,
    PRODUCT_LOADING_OFF,
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