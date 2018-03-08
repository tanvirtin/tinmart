import React from 'react';
import { Navigator } from './Navigator';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

const ModifiedNavigator = (props) => {
    // The store will contain an object which represents the react-navigation modules state called navigation.
    // The following code below will wire this state to Redux store and the redux store will contain two different application state.
    // First being the react-navigation module's state and the second being the Tinant app's state.

    // The navigation object will have the following attributes by default:
    /**
        "navigate": [Function navigate],
        "setParams": [Function setParams],
        "goBack": [Function goBack],
    **/
    // Further more these two attributes are passed in using addNavigationHelpers function:
    /**
        "dispatch": [Function anonymous],
        "state": Object {
          "key": "someKey",
          "params": undefined,
          "routeName": "routeName",
        },
    **/
    return (
        // The naming convention of the attributes inside the addNavigationHelpers() parameter must be dispatch and state and nothing else
        <Navigator navigation = {addNavigationHelpers({
            dispatch: props.dispatch,
            state: props.navigatorStack
        })}/>
    );
}

// The state.navigator object is the state of the Navigator component in the Redux store's Tinant app state. This mapStateToProps makes sure that this
// navigatorStack attributes from the Tinant app's state in the store gets passed down to the ModifiedNavigator resulting in a new component NavigatorWithRedux.
const mapStateToProps = (state) => ({
    navigatorStack: state.navigatorStack
});

// The component NavigatorWithRedux is now finally connected to the Redux store.
export const NavigatorWithRedux = connect(mapStateToProps)(ModifiedNavigator);
