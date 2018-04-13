import { ip } from '../constants/hostIp';
import { port } from '../constants/hostPort';

import Axios from 'axios';
                                      // an object is expected which will look exactly like this when passed on to this function:
                                      // {loadingOn: function, loadingOff: function, action: function}, using ES6 destructing property I extract the attributes
                                      // and store them in a parameter variable.
export const put = (route, putData, {loadingOn, loadingOff, action, errorAction}) => {
    return (dispatch, getState) => {

        // check if loadingOn is not undefined
        if (loadingOn) {
            // when the client side will start fetching the action to render the spinner is dispatched
            dispatch(loadingOn()); // <-- turnLoadingOn will be an action common to every single page, like Login will have it's own, Register will have it's own, dashboard will have it's own
        }

        let completeRoute = 'http://' + ip + ':' + port + '/' + route;

        return Axios.put(completeRoute, putData)
        .then(response => {
            // check if loadinOff is not undefined
            if (loadingOff) {
                // upon successfully retrieving a response from the server the action to not render spinner anymore is dispatched
                dispatch(loadingOff()); // <-- turnLoadingOff will be an action common to every single page, like Login will have it's own, Register will have it's own, dashboard will have it's own
                // also on success I call the dispatch function which will dispatch the action provided to this function passing in the response object from axios
            }
            if (action) {
                dispatch(action(response));
            }
            // also the axios response object is returned so that when this put action is dispatched, a promise will be returned and the
            // val in the .then((val) => {}) will be the response object
            return response; // sends back the response object which will have an attribute called status which will give the success code
        })
        // error occurs usually when status.code is greater than 200, or when server returns a negative code
        .catch(error => {
            // check if loadingOff is not undefined
            if (loadingOff) {
                // upon error in retrieving a response from the server the action to not render spinner anymore is dispatched
                dispatch(loadingOff());
            }

            if (errorAction) {
                dispatch(errorAction(response));
            }

            // also the axios error object is returned so that when this put action is dispatched, a promise will be returned and the
            // val in the .then((val) => {}) will be the response object
            return error.response; // <-- sends back the response object which will have an attribute called status which will give the code of the error
        });
    }
}

                           // destructing an object passed through the parameter
                           // here loadinOn, loadingOff and action (additional action that you may want to invoke) are all action creators which are functions which gets passed in that returns an action object
export const get = (route, {loadingOn, loadingOff, action, errorAction}) => {
    // REDUX WILL INVOKE THE FUNCTION THAT IS BEING RETURNED AND THEN RETURN WHATEVER THIS FUNCTION RETURNS
    return (dispatch, getState) => {
        // check if loadinOn is not undefined
        if (loadingOn) {
            // turn spinner on before the ajax request gets sent
            dispatch(loadingOn());
        }

        let completeRoute = 'http://' + ip + ':' + port + '/' + route;

        // return the promise
        return Axios.get(completeRoute)
        .then(response => {
            // check if loadingOff is not undefined
            if (loadingOff) {
                // turn spinner off as the ajax request completes succcessfully
                dispatch(loadingOff());
            }

            // check to see if an action attribute exists in the object provided
            if (action) {
                dispatch(action(response));
            }

            // response object
            // remember when a .then() procedure returns something you get another promise back
            return response;
        })
        // error object will get passed when the server response is greater than 201
        .catch(error => {
            // check if loadingOff is not undefined
            if (loadingOff) {
                // turn spinner off even if the ajax request completes with an error
                dispatch(loadingOff());
            }

            if (errorAction) {
                dispatch(errorAction(response));
            }

            // response object is returned which is an attribute of the error object
            // remember when a .then() procedure returns something you get another promise back
            return error.response;
        });
    }
}
                                      // destructing an object passed through the parameter
export const post = (route, postData, {loadingOn, loadingOff, action, errorAction}) => {
    return (dispatch, getState) => {
        // check if loadingOn is not undefined
        if (loadingOn) {
            // turn spinner on before the ajax request gets sent
            dispatch(loadingOn());
        }

        let completeRoute = 'http://' + ip + ':' + port + '/' + route;

        return Axios.post(completeRoute, postData)
        .then(response => {
            // check if loadingOff is not undefined
            if (loadingOff) {
                // turn spinner off as the ajax request completes successfully
                dispatch(loadingOff());
            }
            
            // check to see if an action attribute exists in the object provided
            if (action) {
                dispatch(action(response));
            }

            // response object is returned
            // remember when a .then() procedure returns something you get another promise back
            return response;
        })
        .catch(error => {
            // check if loadingOff is not undefined
            if (loadingOff) {
                // turn spinner off even if the ajax request completes with an error
                dispatch(loadingOff());
            }

            if (errorAction) {
                dispatch(errorAction(response));
            }

            // response object is returned which is an attribute of the error object which is a parameter
            // remember when a .then() procedure returns something you get another promise back
            return error.response;
        });
    }
}
