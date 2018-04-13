// Smart container component

import React, { Component } from 'react';

import { DefaultLayout } from '../components/DefaultLayout';

import { ActivitySpinner } from '../components/ActivitySpinner';

import { connect } from 'react-redux';

import { BackHandler } from 'react-native';

import { NavigationActions } from 'react-navigation';

// Imports all action functions as an actions object
import * as actions from '../actions/cart'

class CartContainer extends Component {

    constructor(props) {
        super(props);
        this.onMenuPress = this.onMenuPress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        // will contain the CartCard dumb components
        this.cartCards = []
    }

    componentDidMount() {
        // attach the back event handler
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    async componentWillMount() {
        // remove the back event handler
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

        for (int i = 0; i < )

    }

    onBackPress() {
        // the function that gets attached to the back event handler and gets invoked everytime you press the back button which takes you back to the previous screen
        this.props.navigation.dispatch(NavigationActions.back());
        return true;
    }

    onMenuPress() {
        // open the drawer when the menu button is pressed
        this.props.navigation.navigate('DrawerOpen');
    }

    render() {
        let loading = false;
        return (
            <DefaultLayout
                onMenuPress = {this.onMenuPress}
            >
            {loading && <ActivitySpinner/>}
            </DefaultLayout>
        );
    }

}

const mapStateToProps = (appState, navigationState) => ({
    navigation: navigationState.navigation,
    screenProps: navigationState.screenProps,
    navigatorStack: appState.navigatorStack,
    // will contain all products in the cartItem
    cartItems: appState.cartItems
})

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CartContainer);