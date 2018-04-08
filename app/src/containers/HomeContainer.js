// Smart container component

import React, { Component } from 'react';

import { SearchLayout } from '../components/SearchLayout';

import { connect } from 'react-redux';

import { BackHandler } from 'react-native';

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

        // the onBackPress method needs to be binded to the scope of the component class
        // so that the keyword this can refer to the class the method belongs to despite being
        // passed into different scopes
        this.onBackPress = this.onBackPress.bind(this);

        // the HomeContainer scope 'this' needs to be binded to the function searchBarOnEndEditing
        // as this function will get passed to a different scope and it will still access the HomeContainer scope using this keyword
        this.searchBarOnEndEditing = this.searchBarOnEndEditing.bind(this);

        this.toastTime = 2000;
    }

    // attach a hardware back button event handler
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    // detach the hardware back button handler on component did mount when the component is unmounting
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress() {
        this.props.navigation.navigate('DrawerClose');

        // when true is returned in the back handler function you don't exit the app
        // when false is returned you exit the app
        return true;
    }

    onMenuPress() {
        this.props.navigation.navigate('DrawerOpen');
    }

    searchBarOnEndEditing() {
        alert('Editing ended!');
    }

    render() {
        return (
            <SearchLayout
                onMenuPress = {this.onMenuPress}
                title = {'Home'}
                searchBarOnEndEditing = {this.searchBarOnEndEditing}
            >
            </SearchLayout>
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
