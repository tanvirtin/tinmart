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
        // navigate to the login page immidietly after the intro page
        const resetNavigationStack = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: 'Login'
            })]
        });

        setTimeout(() => this.props.navigation.dispatch(resetNavigationStack), 3000);
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
