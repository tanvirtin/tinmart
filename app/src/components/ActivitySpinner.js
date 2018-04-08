// Dumb component

import React, { Component } from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const ActivitySpinner = props => {
    return (
        <View style = {styles.container}>
            <Spinner color = {appInfo.themeColor} />
        </View>
    );
}

const styles = {
    container: {

    }
}