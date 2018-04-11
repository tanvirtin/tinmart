// Dumb component

/**
 * This component will get rendered whenever a search is invalid
 */
import React, { Component } from 'react';

import { 
    View
} from 'react-native';

import { Text } from 'native-base';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const InvalidSearch = props => {
    return (
        <View style = {style.container}>
            {/* props.message will contain the message of the app*/}
            <Text style = {style.text}>{props.message}</Text>
        </View>
    );
}

// style object which will contain all the styling
const style = {
    text: {
        fontSize: 30,
        color: appInfo.themeColor
    },
    container: {
        // flexDirection needs to be row for justifyContent: 'center' to be used
        // remember justifyContent center aligns items that are next to each other in the x axis to the center
        // since the only item/component we have is the Text component it will be pushed to the center
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '70%'
    }
}