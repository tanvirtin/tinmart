// Dumb component

import React, { Component, View } from 'react';
import { Content } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const KeyboardAwareLayout = (props) => {
    return (
        <KeyboardAwareScrollView
            contentContainerStyle = {styles.container}
            enableOnAndroid = {true}
            extraScrollHeight = {200}
        >
            <Content>
                {props.children}
            </Content>
        </KeyboardAwareScrollView>

    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    container: {
        backgroundColor: 'white',
        alignItems: 'center'
    }
};
