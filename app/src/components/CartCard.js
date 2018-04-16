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
import { 
    Image,
    TouchableOpacity 
} from 'react-native';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const CartCard = props => {
    return (
        <Card>
            {props.clickable && 
                <TouchableOpacity onPress = {props.onCardPress}>
                    <CardItem>
                        <Left>
                            <Thumbnail source = {{uri: props.img}}/>
                            <Text>
                                {props.title}  
                            </Text>
                        </Left>
                    </CardItem>
                </TouchableOpacity>
            }
            {!props.clickable && 
                <CardItem>
                    <Left>
                        <Thumbnail source = {{uri: props.img}}/>
                        <Text>
                            {props.title}  
                        </Text>
                    </Left>
                </CardItem>
            }
            <CardItem>
                <Body>
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
        fontSize: 20
    }
}