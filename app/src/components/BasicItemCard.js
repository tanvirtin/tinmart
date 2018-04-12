// Dumb component

import React, { Component } from 'react';
import { 
    Container, 
    Header, 
    Content, 
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

export const BasicItemCard = props => {
    return (
        <Card>
            <CardItem>
                <Left>
                    <Body>
                        <Text> {props.title} </Text>
                        <Text note> {props.category} </Text>
                    </Body>
                </Left>
            </CardItem>
            <CardItem cardBody>
                <Image resizeMode = 'contain' source={{uri: props.productImg}} style = {styles.cardImg}/>
            </CardItem>
            <CardItem>
                <Left>
                    <Text> {props.description} </Text>
                </Left>
                <Right>
                    <Text style = {styles.price}> {props.price} </Text>
                </Right>
            </CardItem>
        </Card>
    );
}

const styles = {
    cardImg: {
        height: 200, 
        width: null, 
        flex: 1
    },
    price: {
        fontSize: 25
    }
}
