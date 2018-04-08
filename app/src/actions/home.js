// will contain all possible redux actions related to the home view

// import the all the types of action that these action creators will create
import {
    SUBMIT_SEARCH,
    HOME_LOADING_ON,
    HOME_LOADING_OFF
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