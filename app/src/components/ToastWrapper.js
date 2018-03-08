// Dumb component

import React, { Component } from 'react';

import { Toast } from 'react-native-redux-toast';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const ToastWrapper = (props) => {
    return (
        <Toast
            messageStyle = {styles.textStyle}
            containerStyle = {props.style}
        />
    );
}

const styles = {
    textStyle: {
        color: 'white'
    }
}
