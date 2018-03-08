// Smart container component

import React, { Component } from 'react';

import { NoHeaderLayout } from '../components/NoHeaderLayout';
import { LoginForm } from '../components/LoginForm';
import { SubmitButton } from '../components/SubmitButton';
import { RedirectRegister } from '../components/RedirectRegister';

import { connect } from 'react-redux';

// Imports all the actions as an action object from the actions file where all the actions for the redux is
// created for this specific view. The actions object is one big object containing all the actions of this view.
import * as actions from '../actions/login';

import { ToastActionsCreators } from 'react-native-redux-toast';

class LoginContainer extends Component {

    constructor(props) {
        super(props);
        // bind onRegister method so that the this inside the scope of the method
        // is the LoginContainer component scope and not the scope of whatever its being passed to
        this.onSubmit = this.onSubmit.bind(this);
        this.onRegister = this.onRegister.bind(this);
        // bind both onEdits functions and onChangeText functions will be passed down as props to child component, as the keyword 'this'
        // is going to be used within these functions and I want the 'this' keyword to refer to the LoginContainer component
        this.userNameOnEndEdits = this.userNameOnEndEdits.bind(this);
        this.passwordOnEndEdits = this.passwordOnEndEdits.bind(this);
        this.userNameOnChangeText = this.userNameOnChangeText.bind(this);
        this.passwordOnChangeText = this.passwordOnChangeText.bind(this);

        this.animationDelay = 200;
        this.toastTime = 2000;
    }

    // when this button is invoked the form will be passed to this func and
    // the form will be send to the server as a PUT HTTP request
    onSubmit(form) {

        let userNameCheck = this.checkUserName(form.userName);
        let passwordCheck = this.checkPassword(form.password);

        // both these conditions need to be true for the entire if statement to evaluate to true
        if (!userNameCheck && !passwordCheck) {
            this.props.showToast('All information must be filled')
            return;
        }

        // I have to do this unnecessary bit because django jwt module expects a post request with a
        // application/JSON object which has the following attributes username and password and not userName and password
        let loginForm = {};
        loginForm.username = form.userName;
        loginForm.password = form.password;

        this.props.postLoginForm(loginForm).then(response => {
            // if response object is undefined it means that no response object was sent from te server, therefore the post
            // request wasn't sent to the server as the server couldn't be reached.
            if (!response) {
                this.props.showToast('503 Service unavailable')
            } else if (response.status === 200) {

                let authToken = response.data.token;
                // I update the loginStatus reducer
                this.props.authenticationComplete(authToken);

                // Similarly I then clear out the loginForm data as we don't want the userName and password to no longer be stored
                // as we have the authentication token sent to us from the server stored in the Redux store's state's loginStatus attribute.
                this.props.clearLoginForm();

                // navigate to the home page on successful authentication
                this.props.navigation.navigate('Home');

            } else if (response.status === 400) {
                this.props.authenticationError();
                this.props.showToast('Incorrect username or password');
            } else {
                this.props.showToast(response.status + ' error');
            }
        });
    }

    // when this function is triggered we switch the registration page
    // But while the spinner is on and the login view is communicating with the server redirecting to the
    // register view should be disabled.
    onRegister() {
        // If spinner is on we don't go to the register view, the indcation of whether spinner is on or off is determined by the loading
        // attribute of the loginUI reducer state.
        if (!this.props.loginUI.loading) {
            // It is very important to clear out the current changes made to the UI and store by the Login view.
            // Therefore we need to clear out all the changes we made and reset the default values for the attributes
            //  of the store that is responsible for the login view
            this.props.clearLoginUIChanges();
            this.props.navigation.navigate('Register');
        }
    }

    checkUserName(userName) {
        if (userName === '') {
            this.props.noUserName();
            return false;
        }

        this.props.clearUserNameRedBorder();
        return true;
    }

    checkPassword(password) {
        if (password === '') {
            this.props.noPassword();
            return false;
        }

        this.props.clearPasswordRedBorder();
        return true;
    }


    // this function will be called when the user stops typing into the userName input field
    // userName from the form's userName will be passed to this function
    userNameOnEndEdits(userName) {
        // When clicking on a floatinglabel input text field there is an animation which happens. This animation
        // needs to complete before we can re render the component again. If we don't have a settimout then screen
        // re renders while the animation is taking place, this causes an interuption in the animation and stops it abruptly
        setTimeout(() => this.checkUserName(userName), this.animationDelay);
    }


    // this function will be called when the user stops typing into the password input field
    // password from the form's password will be passed to this function
    passwordOnEndEdits(password) {
        // When clicking on a floatinglabel input text field there is an animation which happens. This animation
        // needs to complete before we can re render the component again. If we don't have a settimout then screen
        // re renders while the animation is taking place, this causes an interuption in the animation and stops it abruptly
        setTimeout(() => this.checkPassword(password), this.animationDelay);
    }

    // this function will be called when the user types into the text field every time
    // the userName argument is the previous text in the text field plus the new letter typed in
    userNameOnChangeText(userName) {
        this.props.clearUserNameRedBorder();
        // setUserName Redux action being called
        this.props.setUserName(userName);
    }

    // this function will be called when the user types into the text field every time
    // the password argument is the previous text in the text field plus the new letter typed in
    passwordOnChangeText(password) {
        this.props.clearPasswordRedBorder();
        // setPassword Redux action being called
        this.props.setPassword(password);
    }


    render() {

        let loginUI = this.props.loginUI;
        let loginForm = this.props.loginForm;

        // will contain all the dynamic style property taken from the Redux store
        let styleProps = {
            userNameFieldBorder: loginUI.userNameFieldBorder,
            passwordFieldBorder: loginUI.passwordFieldBorder
        }

        // An object containing functions which will be triggered when text is changed on one of the fields,
        // this object will be passed to the LoginForm to be used.
        let onChangeTexts = {
            userName: this.userNameOnChangeText,
            password: this.passwordOnChangeText
        };

        // the methods of the class userNameOnEndEdits and passwordOnEndEdits is assigned to attributes of
        // an object and this object will be passed in as a prop to the child component LoginForm, this allows
        // the Container component to dictate the logic of the dumb component class.
        let onEndEdits = {
            userName: this.userNameOnEndEdits,
            password: this.passwordOnEndEdits
        };

        return (
            <NoHeaderLayout>
                <LoginForm
                    onSubmit = {this.onSubmit}
                    defaultLoginForm = {loginForm}
                    onEndEdits = {onEndEdits}
                    onChangeTexts = {onChangeTexts}
                    style = {styleProps}
                />
                <SubmitButton isLoading = {loginUI.loading} onSubmit = {() => this.onSubmit(loginForm)}/>
                <RedirectRegister onRegister = {this.onRegister}/>
            </NoHeaderLayout>
        );
    }
}

// returns an object
const mapStateToProps = (appState, navigationState) => ({
        navigation: navigationState.navigation,
        screenProps: navigationState.screenProps,
        navigatorStack: appState.navigatorStack,
        loginUI: appState.loginUI,
        loginForm: appState.loginForm,
        loginStatus: appState.loginStatus
});

// returns an object
const mapDispatchToProps = dispatch => ({
    loadingOn: () => dispatch(actions.loadingOn()),
    loadingOff: () => dispatch(actions.loadingOff()),
    setUserName: (userName) => dispatch(actions.setUserName(userName)),
    setPassword: (password) => dispatch(actions.setPassword(password)),
    authenticationError: () => dispatch(actions.authenticationError()),
    clearUserNameRedBorder: () => dispatch(actions.clearUserNameRedBorder()),
    clearPasswordRedBorder: () => dispatch(actions.clearPasswordRedBorder()),
    noUserName: () => dispatch(actions.noUserName()),
    noPassword: () => dispatch(actions.noPassword()),
    clearLoginForm: () => dispatch(actions.clearLoginForm()),
    clearLoginUIChanges: () => dispatch(actions.clearLoginUIChanges()),
    postLoginForm: (loginForm) => dispatch(actions.postLoginForm(loginForm)),
    authenticationComplete: (token) => dispatch(actions.authenticationComplete(token)),
    showToast: (message) => dispatch(ToastActionsCreators.displayInfo(message, this.toastTime))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
