// Dumb component

import React, { Component } from 'react';
import { 
    Text,
    Animated
} from 'react-native';

// contains basic information about the app
const appInfo = require('../../appInfo.json');

export const Logo = (props) => {
    // checks if a style prop is given to the component
    const propsIsUndefined = props.style === undefined ? true : false;

    // jsx element stored in a variable for conditional rendering in return statement
    const textWithoutProp = <Text style = {styles.logo}> {appInfo.name} </Text>;
    // jsx element stored in a variable for conditional rendering in return statement
    const textWithProp = <Text style = {props.style}> {appInfo.name} </Text>;

    return (
        <Animated.View>
            {/*if a style prop is given then I render the text component with the given style component otherwise I use my defaulty style component*/}
            {propsIsUndefined ? textWithoutProp : textWithProp}
        </Animated.View>
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
