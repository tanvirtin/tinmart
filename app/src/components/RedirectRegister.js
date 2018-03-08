// Dumb component

import React, { Component } from 'react';
import { Body } from 'native-base';
import { Text } from 'react-native';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const RedirectRegister = (props) => {
    return (
        <Body style = {styles.redirect}>
            <Text style = {styles.text}>No account? <Text style = {styles.redirectLink} onPress = {props.onRegister}> Create one! </Text></Text>
        </Body>
    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    redirect: {
        marginTop: '8%'
    },
    text: {
        fontSize: 17
    },
    redirectLink: {
        color: '#0066ff',
        fontSize: 17
    }
}
