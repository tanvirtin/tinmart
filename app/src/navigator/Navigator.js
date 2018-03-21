import React, { Component } from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { Animated, Easing } from 'react-native';

import IntroductionContainer from '../containers/IntroductionContainer';
import HomeContainer from '../containers/HomeContainer';
import LoginContainer from '../containers/LoginContainer';
import RegisterContainer from '../containers/RegisterContainer';
import DrawerContainer from '../containers/DrawerContainer';

// transitionConfig object creator from https://medium.com/async-la/custom-transitions-in-react-navigation-2f759408a053
// for a modal transiting from left to right for every page.
const transitionConfig = () => {
  return {
    transitionSpec: {
      // duration determines how long the animation will last
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;

      const thisSceneIndex = scene.index;
      const width = layout.initWidth;

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      });

      return {
        transform: [ { translateX } ]
      };
    },
  }
}

const Drawer = DrawerNavigator({
    // The views below will have the ability from left to access the drawer class
    Home: {screen: HomeContainer}
}, {
    // contentComponent means that we can define our own view component for the drawer
    // this means that our DrawerContainer component will be responsible for the drawer view.
    contentComponent: props => <DrawerContainer {...props}/>,
    // the options below are mandatory to avoid an error generated when contentComponent is used
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
});


export const Navigator = StackNavigator({
    Introduction: {screen: IntroductionContainer},
    // The third index will be another navigation stack itself, this stack will contain all the components
    // which will have access to the drawer, or in other words the screen can be swiped from the left on these
    // views to access the drawer. This navigation stack will be aliased by the key ViewsWithDrawer
    ViewsWithDrawer: {screen: Drawer},
    // The first screen in the program will be the LoginContainer, aliased by the Login attribute
    Login: {screen: LoginContainer},
    // Then the second index in the stack will be the RegisterContainer, aliased by the Register attribute
    Register: {screen: RegisterContainer}
}, {
    headerMode: 'none',
    transitionConfig
});
