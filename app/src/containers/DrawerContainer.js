// Smart container component

import React, { Component } from 'react';

import { Image } from 'react-native';

import { NoHeaderLayout } from '../components/NoHeaderLayout';

import { connect } from 'react-redux';

// imports all action functions as an acitons object
import * as actions from '../actions/drawer';


class DrawerContainer extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <NoHeaderLayout>
                {/* TODO - Insert a Profile picture Image component here */}
            </NoHeaderLayout>
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

});

export default connect(mapStateToProps, null)(DrawerContainer);
