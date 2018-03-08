// Dumb component

import React, { Component } from 'react';
import { Text } from 'react-native';
import {
    Form,
    Item,
    Label,
    Input
} from 'native-base';

import { ToastWrapper } from './ToastWrapper';

const appInfo = require('../../appInfo.json');

export const LoginForm = (props) => {
    // NOTE** This has to be renamed from form to loginForm, as RegisterForm also contains a form
    // and somehow LoginForm component can access the form of the RegisterForm.
    // loginForm needs to be a deep copy of the loginForm attribute of the store's state object, so that changing
    // this value doesn't directly modify the actual data in the store as everything in JavaScript is passed by reference.
    let loginForm = {...props.defaultLoginForm}

    return (
        <Form style = {styles.form}>
            <Text style = {styles.logo}> {appInfo.name} </Text>
            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.userNameFieldBorder}}>
                <Label style = {styles.label}> Username </Label>
                <Input onEndEditing = {() => props.onEndEdits.userName(loginForm.userName)} onChangeText = {(text) => props.onChangeTexts.userName(text)}/>
            </Item>
            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.passwordFieldBorder}}>
                <Label style = {styles.label}> Password </Label>
                <Input onEndEditing = {() => props.onEndEdits.password(loginForm.password)} secureTextEntry onChangeText = {(text) => props.onChangeTexts.password(text)}/>
            </Item>
            <ToastWrapper style = {styles.toastContainerStyle}/>
        </Form>
    );
}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    toastContainerStyle: {
        backgroundColor: appInfo.themeColor,
        borderRadius: 0,
        marginBottom: '14%'
    },
    label: {
        color: 'black'
    },
    form: {
        // marginTop will push the form component down
        marginTop: '35%',
    },
    logo: {
        textAlign: 'center',
        color: appInfo.themeColor,
		fontSize: 40,
		fontWeight: 'bold',
		marginBottom: '10%'
    }
};
