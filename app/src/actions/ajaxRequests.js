import { ip } from '../constants/hostIp';
import { port } from '../constants/hostPort';

import Axios from 'axios';
                                      // an object is expected which will look exactly like this when passed on to this function:
                                      // {loadingOn: function, loadingOff: function, action: function}, using ES6 destructing property I extract the attributes
                                      // and store them in a parameter variable.
export const put = (route, putData, {loadingOn, loadingOff, action}) => {
    return (dispatch, getState) => {
        // when the client side will start fetching the action to render the spinner is dispatched
        dispatch(loadingOn()); // <-- turnLoadingOn will be an action common to every single page, like Login will have it's own, Register will have it's own, dashboard will have it's own

        let completeRoute = 'http://' + ip + ':' + port + '/' + route;

        return Axios.put(completeRoute, putData, {
            headers: {
                   // All requests will have a authorization header attached to it with the value being the jwt token that the
                   // server sent us. This value is from the store and if there is no token saved in the client side in the
                   // Redux store's loginStatus attribute it will be an empty string.
                   Authorization: getState().loginStatus.authToken
            }
        })
        .then(response => {
            // upon successfully retrieving a response from the server the action to not render spinner anymore is dispatched
            dispatch(loadingOff()); // <-- turnLoadingOff will be an action common to every single page, like Login will have it's own, Register will have it's own, dashboard will have it's own
            // also on success I call the dispatch function which will dispatch the action provided to this function passing in the response object from axios
            if (action) {
                dispatch(action(response));
            }
            // also the axios response object is returned so that when this put action is dispatched, a promise will be returned and the
            // val in the .then((val) => {}) will be the response object
            return response; // sends back the response object which will have an attribute called status which will give the success code
        })
        // error occurs usually when status.code is not equal to 200, or when server returns a negative code
        .catch(error => {
            // upon error in retrieving a response from the server the action to not render spinner anymore is dispatched
            dispatch(loadingOff());
            // also the axios error object is returned so that when this put action is dispatched, a promise will be returned and the
            // val in the .then((val) => {}) will be the response object
            return error.response; // <-- sends back the response object which will have an attribute called status which will give the code of the error
        });
    };
}
                                      // destructing an object passed through the parameter
export const post = (route, postData, {loadingOn, loadingOff, action}) => {
    return (dispatch, getState) => {

        // turn spinner on as the ajax request before the ajax request gets sent
        dispatch(loadingOn());

        let completeRoute = 'http://' + ip + ':' + port + '/' + route;

        return Axios.post(completeRoute, postData, {
            headers: {
                   // All requests will have a authorization header attached to it with the value being the jwt token that the
                   // server sent us. This value is from the store and if there is no token saved in the client side in the
                   // Redux store's loginStatus attribute it will be an empty string.
                   Authorization: getState().loginStatus.authToken
            }
        })
        .then(response => {

            // turn spinner off as the ajax request completes successfully
            dispatch(loadingOff());

            // check to see if an action attribute exists in the object provided
            if (action) {
                dispatch(action(response));
            }

            // response object is returned
            return response;
        })
        .catch(error => {

            // turn spinner off even if the ajax request completes with an error
            dispatch(loadingOff());

            // response object is returned which is an attribute of the error object which is a parameter
            return error.response;
        });
    };
}
