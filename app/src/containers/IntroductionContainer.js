// Smart container component

import React, { Component } from 'react';
import { NoHeaderLayout } from '../components/NoHeaderLayout';
import { Logo } from '../components/Logo';
import { NavigationActions } from 'react-navigation';
import { Text } from 'native-base';
import { 
    Animated,
    StatusBar
} from 'react-native';
import { connect } from 'react-redux';


class IntroductionContainer extends Component {
    constructor(props) {
        super(props);
    }

    // before the component renders we want to set some attributes for this class which are our animated attributes
    componentWillMount() {
        this.animatableOpacity = new Animated.Value(0);
    }

    // When the component finishes rendering
    componentDidMount() {
        StatusBar.setHidden(true);
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
                    routeName: 'ViewsWithDrawer'
                })
            ]
        });

        // when the component mounts I change the varibale that is an animated value to animate the view which
        // has the variable inside a style prop object as an attribute
        Animated.timing(this.animatableOpacity, {
            toValue: 1,
            duration: 1500
        }).start();

        setTimeout(() => this.props.navigation.dispatch(navigatorStackResetAction), 3000);
    }
    
    // as the component is about to be removed from the DOM this method will get invoked
    componentWillUnmount() {
        // when this method gets invoked I will show the status bar again
        StatusBar.setHidden(false);
    }

    render() {
        let animatableStyleObject = {
            opacity: this.animatableOpacity
        }
        return (
            <NoHeaderLayout>
                <Logo animatableStyles = {animatableStyleObject}/>
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
