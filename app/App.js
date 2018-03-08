import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { NavigatorWithRedux } from './src/navigator/NavigatorWithRedux';
import configureStore from './src/store/configureStore';
import { ToastWrapper } from './src/components/ToastWrapper';

const store = configureStore();

class Tinant extends Component {
    render() {
        return (
            <Provider store = {store}>
                <NavigatorWithRedux/>
            </Provider>
        );
    }
}

// console.log(store.getState); // -> this will always return the entire state of Tinant's app, as getState simply returns the state attribute inside the store
                                // this means that getState() will not return the react-navigation modules state from the Redux store, as the attribute for that state
                                // is called navigation and not state.
export default Tinant;

AppRegistry.registerComponent('Tinant', () => Tinant);
