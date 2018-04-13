// Dumb component

import React, { Component } from 'react';
import {
    Card,
    CardItem,
    Thumbnail,
    Text,
    Button,
    Icon,
    Left,
    Body,
    Right
} from 'native-base';
import { Image } from 'react-native';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const CartCard = props => {
    return (
        <Card>
            <CardItem>
                <Left>
                    <Thumbnail source = {{uri: props.img}}/>
                </Left>
            </CardItem>
            <CardItem>
                <Body>
                    <Text>
                        {props.title}  
                    </Text>
                    <Text style = {styles.price}>
                        Price: $ {props.price}
                    </Text>
                </Body>
            </CardItem>
        </Card>
    );
}

const styles = {
    price: {
        paddingTop: '7%'
    }
}