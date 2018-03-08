// Dumb component

import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';

import Button from 'apsl-react-native-button';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const SubmitButton = (props) => {
    return (
        <Button
            activeOpacity = {1.0}
            activityIndicatorColor = {appInfo.themeColor}
            isLoading = {props.isLoading}
            style = {styles.opacity}
            onPress = {props.onSubmit}
        >
            <Text style = {styles.button}> Submit </Text>
        </Button>
    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    opacity: {
        backgroundColor: appInfo.themeColor,
        marginTop: '10%',
        width: 350,
        height: 55
    },
    button: {
        textAlign: 'center',
        height: 60,
        fontSize: 18,
        color: 'white',
        paddingTop: '4.5%',
        fontFamily: 'sans-serif',
    }
};
