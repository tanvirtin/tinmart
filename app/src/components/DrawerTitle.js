// Dumb component

import React, { Component } from 'react';
import { 
    View,
    Text
 } from 'react-native';
import { Logo } from './Logo';

// contains basic information about the app
const appInfo = require('../../appInfo.json');

// responsible for the Title in the Drawer component
export const DrawerTitle = props => {

    console.log(props.loginStatus);

    return (
        <View style = {styles.container}>
            <Logo style = {styles.logo}/>
            <Text style = {styles.loginText}> SIGN IN </Text>
        </View>
    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    container: {
        // flex determines how much space the current component will occupy in the component it belongs to
        flex: 0.1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: appInfo.themeColor
    },
    // style for the logo in the drawer Title screen so that it looks well formated
    logo: {
        color: appInfo.themeColor,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: '5%',
        marginTop: '3%',
        color: 'white'
    },
    loginText: {
        marginLeft: '6.5%',
        color: 'white'
    }
}