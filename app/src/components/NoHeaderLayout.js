// Dumb component

import React, { Component } from 'react';
import {
    Container,
    Content,
} from 'native-base';
import { View } from 'react-native';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const NoHeaderLayout = (props) => {
    return (
        <View style = {styles.container}>
            {props.children}
        </View>
    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    container: {
        flex:1,
        backgroundColor: 'white',
        justifyContent: 'center'
    }
};
