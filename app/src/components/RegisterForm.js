// Dumb component

import React, { Component } from 'react';
import { Text } from 'react-native';
import {
    Form,
    Item,
    Label,
    Input,
    Picker
} from 'native-base';
import DatePicker from 'react-native-datepicker';

import { ToastWrapper } from './ToastWrapper';

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

export const RegisterForm = (props) => {
    // NOTE** - This has to be renamed from form to registerForm, as LoginForm also contains a this.form
    // and somehow RegisterForm component can access the this.form of the LoginForm.

    // NOTE** - Everytime this component renders all the variables that this component contains will get re initialized,
    //          therefore registerForm will get reinitialized everytime the submit button is pressed, which is when
    //          the re-rendering of the component happens.

    // To fix this problem the registration form must be stored in a redux store, so that when the form resets it can be
    // retrieved from the redux store, which will be passed down to this component as a prop by it's container component.

    // NOTE** - VERY IMPORTANT - Now if we did this let registerForm = props.defaultRegisterForm, changing this data will
    // DIRECTLY mutate the data of the store! Remember this is disallowed as Redux store's state attributes can only be
    // changed by an immutable fashion. If we allow this to happen then the initialState object will directly get changed!
    // as essentially the state of registerForm reducer is essentially its initialState object. So to fix this prooblem we need to
    // deep copy the store's attribute registerForm and assign it as registerForm variable.
    let registerForm = {...props.defaultRegisterForm};


    // TODO - FIX DATE PICKER UI, closeModal gets invoked only when the cancel button is picked when the DatePicker opens.

    return (
        <Form>
            <Text style = {styles.logo}> {appInfo.name} </Text>

            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.userNameFieldBorder}}>
                <Label style = {styles.label}> Username <Text style = {styles.invalidText}> {props.invalidTexts.invalidTextUserName} </Text></Label>
                <Input onEndEditing = {() => props.onEndEdits.userName(registerForm.userName)} onChangeText = {(text) => props.onChangeTexts.userName(text)}/>
            </Item>


            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.passwordFieldBorder}}>
                <Label style = {styles.label}> Password <Text style = {styles.invalidText}> {props.invalidTexts.invalidTextPassword} </Text></Label>
                <Input onEndEditing = {() => props.onEndEdits.password(registerForm.password)} secureTextEntry onChangeText = {(text) => props.onChangeTexts.password(text)}/>
            </Item>

            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.confirmPasswordFieldBorder}}>
                <Label style = {styles.label}> Confirm Password <Text style = {styles.invalidText}> {props.invalidTexts.invalidTextConfirmPassword} </Text></Label>
                <Input onEndEditing = {() => props.onEndEdits.confirmPassword(registerForm.confirmPassword, registerForm.password)} secureTextEntry onChangeText = {(text) => props.onChangeTexts.confirmPassword(text)} />
            </Item>


            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.emailFieldBorder}}>
                <Label style = {styles.label}> Email <Text style = {styles.invalidText}> {props.invalidTexts.invalidTextEmail} </Text></Label>
                <Input onEndEditing = {() => props.onEndEdits.email(registerForm.email)} onChangeText = {(text) => props.onChangeTexts.email(text)}/>
            </Item>


            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.firstNameFieldBorder}}>
                <Label style = {styles.label}> First name </Label>
                <Input onEndEditing = {() => props.onEndEdits.firstName(registerForm.firstName)} onChangeText = {(text) => props.onChangeTexts.firstName(text)}/>
            </Item>

            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.lastNameFieldBorder}}>
                <Label style = {styles.label}> Last name </Label>
                <Input onEndEditing = {() => props.onEndEdits.lastName(registerForm.lastName)} onChangeText = {(text) => props.onChangeTexts.lastName(text)}/>
            </Item>

            <Item floatingLabel style = {{marginRight: '5%', borderColor: props.style.phoneFieldBorder}}>
                <Label style = {styles.label}> Phone <Text style = {styles.invalidText}> {props.invalidTexts.invalidTextPhone} </Text></Label>
                <Input onEndEditing = {() => props.onEndEdits.phone(registerForm.phone)} onChangeText = {(text) => props.onChangeTexts.phone(text)}/>
            </Item>

            <Item style = {{marginRight: '5%', borderColor: props.style.dobFieldBorder}}>
                <DatePicker
                    style = {styles.datePicker}
                    date = {registerForm.dob}
                    mode = 'date'
                    placeholder = 'Date of birth'
                    format = 'YYYY-MM-DD'
                    minDate = '1920-01-01'
                    maxDate = '2018-12-31'
                    customStyles = {styles.datePickerCustomStyle}
                    iconSource = {require('../assets/date-picker.png')}
                    onDateChange = {(date) => {
                        props.onChangeTexts.dob(date);
                        props.onEndEdits.dob(date);
                    }}
                    onCloseModal = {() => props.onEndEdits.dob(registerForm.dob)}
                />
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
        marginBottom: '140%'
    },
    invalidText: {
        fontSize: 12,
        color: 'red'
    },
    label: {
        color: 'black'
    },
    inputBox: {
        marginRight: '5%'
    },
    logo: {
        textAlign: 'center',
        color: appInfo.themeColor,
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: '10%',
        marginTop: '30%'
    },
    datePicker: {
        marginTop: '10%',
    },
    datePickerCustomStyle: {
        dateIcon: {
            width: 20,
            height: 20
        },
        dateInput: {
            // border width 0 removes the borders on the specific side
            borderWidth: 0,
        },
        dateText: {
            fontSize: 18
        },
        placeholderText: {
            fontSize: 18,
            color: 'black'
        }
    }
};
