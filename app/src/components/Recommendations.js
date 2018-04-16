// Dumb component

import React, { Component } from 'react';
import { 
    Text,
    View,
    ListView
} from 'react-native';

// contains basic information about the app
const appInfo = require('../../appInfo.json');

export const Recommendations = props => {
    return (
        <View>
            {props.similar && <Text style = {styles.text}> Similar Products: </Text>}
            <ListView style = {styles.similar}
                horizontal = {true}
                dataSource = {props.similarProducts}
                renderRow = {(rowData) => <View>{rowData}</View>}
                enableEmptySections={true}
            />
            {props.comp && <Text style = {styles.text}> Complementary Products: </Text> }                
            <ListView style = {styles.complementary}
                horizontal = {true}
                dataSource = {props.complementaryProducts}
                renderRow = {(rowData) => <View>{rowData}</View>}
                enableEmptySections={true}
            />
        </View>
    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    text: {
        fontSize: 18
    },
    similar: {
        paddingTop: '2%',
        height: 150,
    },
    complementary: {
        height: 150
    }
};