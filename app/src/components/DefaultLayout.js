// Dumb component

import React, { Component } from 'react';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Icon,
    Text,
    Button
} from 'native-base';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const DefaultLayout = (props) => {
    return (
        <Container style = {styles.container}>
            <Content>
                <Header style = {styles.header} androidStatusBarColor = {appInfo.themeColor}>
                    <Left>
                        <Button transparent onPress = {props.onMenuPress}>
                            <Icon name = 'menu'/>
                        </Button>
                    </Left>
                    <Body>
                        <Text style = {styles.title}>
                            {props.title}
                        </Text>
                    </Body>
                    <Right/>
                </Header>
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
    },
    header: {
        backgroundColor: appInfo.themeColor
    },
    title: {
        color: 'white',
        fontSize: 20
    }
};
