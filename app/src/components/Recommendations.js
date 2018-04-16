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
            {props.similar && <Text> Similar Products: </Text>}
            <ListView style = {styles.similar}
                horizontal = {true}
                dataSource = {props.similarProducts}
                renderRow = {(rowData) => <Text>{rowData}</Text>}
                enableEmptySections={true}
            />
            {props.comp && <Text> Complementary Products: </Text> }                
            <ListView style = {styles.complementary}
                horizontal = {true}
                dataSource = {props.complementaryProducts}
                renderRow = {(rowData) => <Text>{rowData}</Text>}
                enableEmptySections={true}
            />
        </View>
    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    similar: {
        paddingTop: '2%',
        height: 50,
    },
    complementary: {
        height: 50
    }
};