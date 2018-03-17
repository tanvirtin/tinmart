// Dumb component

import React, { Component } from 'react';
import { Text } from 'react-native';

// contains basic information about the app
const appInfo = require('../../appInfo.json');

// TODO - Add propTypes and defaultProps to all dumb components whenever necessary.
//        By default the logo will be big but props can be passed to the Logo component
//        in order to modify the fontSize and marginTop.

export const Logo = (props) => {
    // I deep copy the logo object from styles into the style props, but then from
    // whatever props the user provides I assign the styles to those props if they exist
    return (
        <Text style = {{...styles.logo}}> {appInfo.name} </Text>
    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    logo: {
        textAlign: 'center',
        color: appInfo.themeColor,
        fontSize: 50,
        fontWeight: 'bold',
        marginTop: '115%'
    }
}
