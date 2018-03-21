// Smart container component

import React, { Component } from 'react';

import { Image } from 'react-native';

import { NoHeaderLayout } from '../components/NoHeaderLayout';

import { connect } from 'react-redux';

import { DrawerTitle } from '../components/DrawerTitle';

// imports all action functions as an acitons object
import * as actions from '../actions/drawer';

// responsible for the drawer view
class DrawerContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NoHeaderLayout>
                {/* 
                    loginStatus needs to be passed to the title to determine whether the sign in button should be displayed or not.
                    If the user has logged in then their first name will be displayed instead of the sign in option
                */}
                <DrawerTitle loginStatus = {this.props.loginStatus}/>
            </NoHeaderLayout>
        );
    }

}

// returns an object
const mapStateToProps = (appState, navigationState) => ({
    navigation: navigationState.navigation,
    screenProps: navigationState.screenProps,
    navigatorStack: appState.navigatorStack,
    // DrawerContainer container component needs to have access to the loginStatus attribute
    // of the store so that it can display the Sign in option depending only on whether the user has logged in or not
    loginStatus: appState.loginStatus
});

// returns an object
const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, null)(DrawerContainer);
