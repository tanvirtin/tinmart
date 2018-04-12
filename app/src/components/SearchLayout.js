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
    Badge
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
                    <Left style = {styles.menu}>
                        <Button transparent onPress = {props.onMenuPress}>
                            <Icon name = 'menu'/>
                        </Button>
                    </Left>
                    <SearchBar onChangeText = {props.searchBarOnChangeText} onEndEditing = {props.searchBarOnEndEditing} style = {styles.searchBar}/>
                    <Right style = {styles.cart}>
                        <Button transparent onPress = {props.onCartPress}>
                            <Icon name = 'md-cart'/>
                        </Button>
                        {/* Badge gets displayed only if a prop is passed which is expected to be a boolean is true*/}
                        {props.showBadge &&
                            <Badge style = {styles.badge}>
                                <Text style = {styles.badgeText}>{props.numCartItems}</Text>
                            </Badge>
                        }
                    </Right>
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
    menu: {
        flex: 0.8
    },
    // flex with the value 4 is very important in order to space the elements close to each other
    searchBar: {
        flex: 5
    },
    cart: {
        flex: 0.9
    },
    badge: {
        position: 'absolute',
        height: 28,
        width: 25,
        right: '-19%',
        top: '-10%'
    },
    badgeText: {
        fontSize: 12,
    }

};
