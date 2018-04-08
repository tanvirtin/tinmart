// Dumb component

import React, { Component } from 'react';

import {
    TouchableOpacity
} from 'react-native';

import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Icon,
    Text,
    Button,
} from 'native-base';

import { SearchBar } from './SearchBar';


// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

// TODO - Pass functions as props which extracts the text and makes queries to the server from the input box

export const SearchLayout = props => {
    return (
        <Container style = {styles.container}>
            <Content>
                <Header searchBar rounded style = {styles.header} androidStatusBarColor = {appInfo.themeColor}>
                    <Left>
                        <Button transparent onPress = {props.onMenuPress}>
                            <Icon name = 'menu'/>
                        </Button>
                    </Left>
                    <SearchBar onEndEditing = {props.searchBarOnEndEditing} style = {styles.searchBar}/>
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
    // flex with the value 4 is very important in order to space the elements close to each other
    searchBar: {
        flex: 4,
        marginRight: '6%'
    }
};
