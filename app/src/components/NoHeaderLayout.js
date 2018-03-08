// Dumb component

import React, { Component } from 'react';
import {
    Container,
    Content,
} from 'native-base';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const NoHeaderLayout = (props) => {
    return (
        <Container style = {styles.container}>
            <Content>
                {props.children}
            </Content>
        </Container>
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
