// Dumb component

import React, { Component } from 'react';

import {
    Item,
    Icon,
    Input
} from 'native-base';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const SearchBar = props => {
    return (
        <Item style = {props.style}>
            <Icon name = 'ios-search'/>
            {/* The props that need to be passed are onChangeText and onEndEditing */}
            <Input onChangeText = {props.onChangeText} onEndEditing = {props.onEndEditing} placeholder = 'Search'/>
        </Item>
    );
}