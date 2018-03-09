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
    Item,
    Input,
    Button
} from 'native-base';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const SearchLayout = (props) => {
    return (
        <Container style = {styles.container}>
            <Content>
                <Header searchBar rounded style = {styles.header} androidStatusBarColor = {appInfo.themeColor}>
                    <Left>
                        <Button transparent onPress = {props.onMenuPress}>
                            <Icon name = 'menu'/>
                        </Button>
                    </Left>
                    <Item style = {styles.searchBar}>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" />
                    </Item>
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
    },
    searchBar: {
        flex:4
    }
};
