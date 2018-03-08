// Smart container component

import React, { Component } from 'react';

import { DefaultLayout } from '../components/DefaultLayout';

import { connect } from 'react-redux';

// Imports all action functions as an actions object
import * as actions from '../actions/home';

import { ToastActionsCreators } from 'react-native-redux-toast';

class HomeContainer extends Component {

    constructor(props) {
        // construct the base class passing the props parameter passed in through the constructor of the sub class
        super(props);

        // these functions need to be bounded so that the keyword 'this' belongs to the HomeContainer class scope
        // when these functions will be passed to their children which have a different scope
        this.onMenuPress = this.onMenuPress.bind(this);

        this.toastTime = 2000;
    }

    onMenuPress() {
        this.props.navigation.navigate('DrawerOpen');
    }

    render() {
        return (
            <DefaultLayout
                onMenuPress = {this.onMenuPress}
                title = {'Home'}
            >

            </DefaultLayout>
        );
    }
}

// returns an object
const mapStateToProps = (appState, navigationState) => ({
    navigation: navigationState.navigation,
    screenProps: navigationState.screenProps,
    navigatorStack: appState.navigatorStack
});

// returns an object
const mapDispatchToProps = dispatch => ({
    showToast: message => dispatch(ToastActionsCreators.displayInfo(message, this.toastTime))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
