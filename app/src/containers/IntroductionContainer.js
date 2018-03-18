// Smart container component

import React, { Component } from 'react';
import { NoHeaderLayout } from '../components/NoHeaderLayout';
import { Logo } from '../components/Logo';
import { NavigationActions } from 'react-navigation';
import { Text } from 'native-base';

import { connect } from 'react-redux';


class IntroductionContainer extends Component {
    constructor(props) {
        super(props);
    }

    // When the component finishes rendering
    componentDidMount() {
        // NavigationActions.reset() returns an action object and it is an action creator this action contains
        // the appropriate type and payload for the reducer in provided by react navigation to be activated
        const navigatorStackResetAction = NavigationActions.reset({
            // when null reset will reset the root navigator
            key: null,
            // when resets the root navigator the index of the stack we want to be is at 0, which is the first index
            index: 0,
            actions: [
                // we reset the entire navigator stack with these new routes now, you can be at a specific index
                // according to these routes by specifying the index attribute
                NavigationActions.navigate({
                    routeName: 'Login'
                })
            ]
        });
        setTimeout(() => {this.props.navigation.dispatch(navigatorStackResetAction)}, 2000);
    }

    render() {
        return (
            <NoHeaderLayout>
                <Logo/>
            </NoHeaderLayout>
        );
    }
}

// function that returns an object
const mapStateToProps = (appState, navigationState) => ({
    navigation: navigationState.navigation,
    screenProps: navigationState.screenProps,
    navigatorStack: appState.navigatorStack
});

// function returns an empty object
const mapDispatchToProps = dispatch => ({

});

// The function call to connect() returns another function which takes in one parameter
// as an argument which is our IntroductionContainer component itself.
export default connect(mapStateToProps, mapDispatchToProps)(IntroductionContainer);
