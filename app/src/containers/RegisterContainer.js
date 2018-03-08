// Smart container component

import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';

import { KeyboardAwareLayout } from '../components/KeyboardAwareLayout';
import { RegisterForm } from '../components/RegisterForm';
import { SubmitButton } from '../components/SubmitButton';

import { connect } from 'react-redux';

import * as EmailValidator from 'email-validator';

import * as actions from '../actions/register';

import { ToastActionsCreators } from 'react-native-redux-toast';

class RegisterContainer extends Component {

    constructor(props) {
        super(props);
        // All these variables need to be true in order for the ajax request to be sent
        this.userNameCheck = false;
        this.passwordCheck = false;
        this.confirmPasswordCheck = false;
        this.emailCheck = false;
        this.firstNameCheck = false;
        this.lastNameCheck = false;
        this.phoneCheck = false;
        this.dobCheck = false;
        // the animation delay time for displaying invalid UI graphics
        this.animationDelay = 200;
        // toast time length
        this.toastTime = 2000;

        // binding the functions that get passed down to child components so that the this keyword of the function
        // is that of the class the function belongs to and retains it whenever its passed to different scopes
        this.onBackPress = this.onBackPress.bind(this);
        this.userNameOnEndEdits = this.userNameOnEndEdits.bind(this);
        this.passwordOnEndEdits = this.passwordOnEndEdits.bind(this);
        this.confirmPasswordOnEndEdits = this.confirmPasswordOnEndEdits.bind(this);
        this.emailOnEndEdits = this.emailOnEndEdits.bind(this);
        this.firstNameOnEndEdits = this.firstNameOnEndEdits.bind(this);
        this.lastNameOnEndEdits = this.lastNameOnEndEdits.bind(this);
        this.phoneOnEndEdits = this.phoneOnEndEdits.bind(this);
        this.dobOnEndEdits = this.dobOnEndEdits.bind(this);
        this.userNameOnChangeText = this.userNameOnChangeText.bind(this);
        this.passwordOnChangeText = this.passwordOnChangeText.bind(this);
        this.confirmPasswordOnChangeText = this.confirmPasswordOnChangeText.bind(this);
        this.emailOnChangeText = this.emailOnChangeText.bind(this);
        this.firstNameOnChangeText = this.firstNameOnChangeText.bind(this);
        this.lastNameOnChangeText = this.lastNameOnChangeText.bind(this);
        this.phoneOnChangeText = this.phoneOnChangeText.bind(this);
        this.dobOnChangeText = this.dobOnChangeText.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    // gets triggered when the back button is pressed
    onBackPress() {
        if (this.props.navigatorStack.index === 0) {
            return false;
        }

        // TODO - CREATE A REDUCER WHICH NEEDS TO REFRESH THE LOGIN PAGE, BY REFRESH I MEAN CLEARING ALL THE STATE OF THE LOGIN PAGE

        // First thing I do when back button is pressed is reset the register form that is submitted to the store
        // and then I go back to the login page so that whem the user clicks on the register page again, they see a fresh new page.
        this.props.clearRegisterForm();
        this.props.clearRegisterUIChanges();

        this.props.navigation.dispatch(NavigationActions.back());

        return true;
    }

    // gets triggered when the submit button is pressed
    onSubmit(form) {
        // Everytime the submit button is pressed the registerForm attribute in the register attribute of the store's state
        // is updated using the registerForm passed down as a parameter to this function.
        this.props.saveRegisterForm(form);


        // if all the checks pass only then can we submit the form using ajax request
        if (this.userNameCheck && this.passwordCheck && this.confirmPasswordCheck && this.emailCheck && this.firstNameCheck && this.lastNameCheck && this.phoneCheck && this.dobCheck) {
            form.phone = this.processPhoneNumber(form.phone);
            // Now I prepare the registerForm data to be sent, by copying over the form data and deleting the confirm password attribute.
            registerForm = {...form};
            delete registerForm.confirmPassword;

            this.props.postRegisterForm(registerForm).then(response => {
                // if response is undefined then the server returned no response at all meaning the server
                // must be down, in which case a 503 error must have occured which gets displayed with a toast
                if (!response) {
                    this.props.showToast('503 Service unavailable');
                } else if (response.status === 409) {
                    // store the error object sent by the server into a variable
                    let error = response.data;

                    if (error.message === 'username and email already exists') {
                        this.props.userNameExists();
                        this.props.emailExists();
                    } else if (error.message === 'username already exists') {
                        this.props.userNameExists();
                    } else {
                        // this case is when an email sent already exists in the database
                        this.props.emailExists();
                    }
                } else if (response.status === 400) {
                    this.props.showToast('400 Bad Request');
                } else if (response.status === 200){
                    // First thing I do when I submit the form is reset the register form that is submitted to the store
                    // and then I go back to the login page so that whem the user clicks on the register page again, they see a fresh new page.
                    this.props.clearRegisterForm();
                    this.props.clearRegisterUIChanges();

                    // toast is shown indicating success
                    this.props.showToast('Registration complete!');

                    setTimeout(() => this.props.navigation.dispatch(NavigationActions.back()), this.toastTime);
                } else {
                    // for any other error I show the status code sent by the server
                    this.props.showToast(response.status + ' error');
                }
            });
            return;
        }
        // If any of the checks are false and submit button is pressed and lets say the user never really
        // typed anything in any text input, then all the text fields which had no inputs had to be highlighted.
        this.checkUserName(form.userName);
        this.checkPassword(form.password);
        this.checkConfirmPassword(form.confirmPassword);
        this.checkEmail(form.email);
        this.checkFirstName(form.firstName);
        this.checkLastName(form.lastName);
        this.checkPhone(form.phone);
        this.checkDob(form.dob);

        this.props.showToast('All information must be filled');
    }

    checkUserName(userName) {
        if (userName === '') {
            // this needs to be done just so that any error message above is gotten rid off
            this.props.correctUserName();
            this.props.noUserName();
            return false;
        }

        this.props.correctUserName();
        return true;
    }

    // validates whether the password is correct or not
    // TODO - More testing
    checkPassword(password) {

        // First I check if the password string is empty, if it is that means I need to trigger the noPassword
        // action which will cause the reducer to change the value of the borderColor only to red for the password field which is
        // an attribute in register attribute of the store's state.
        if (password === '') {
            // this needs to be done just so that any error message above is gotten rid off
            this.props.correctPassword();
            this.props.noPassword();
            return false;
        }

        let lowerCase = false;
        let upperCase = false;
        let specialChar = false;
        let numberChar = false;

        for (let i = 0; i < password.length; ++i) {
            // covert the letter into char code for ascii table comparisons
            charCode = password.charCodeAt(i);
            // checks for uppercase letters
            if (charCode > 64 && charCode < 91) {
                upperCase = true;
            // checks for lowercase letters
            } else if (charCode > 96 && charCode < 123) {
                lowerCase = true;
            // checks for all the special characters in the ASCII table
            } else if ((charCode > 32 && charCode < 48) || (charCode > 57 && charCode < 65) || (charCode > 90 && charCode < 97)) {
                specialChar = true;
            // checks for number values in the ASCII tables
            } else if (charCode > 47 && charCode < 57) {
                numberChar = true;
            }

        }

        // The entire expression needs to be true in order for the if statement to evaluate to true
        // any one of the values resulting in false will fail to make the if statement true
        if (password.length > 6 && lowerCase && upperCase && specialChar && numberChar) {
            this.props.correctPassword();
            return true;
        }
        // by default the color is set to red, as this takes care of the empy string case
        this.props.weakPassword();
        return false;
    }


    checkConfirmPassword(confirmPassword, password) {
        // first check is to see if the confirm password field is empty
        if (confirmPassword === '') {
            // this needs to be done just so that any error message above is gotten rid off
            this.props.correctConfirmPassword();
            this.props.noConfirmPassword();
            return false;
        } else if (password === confirmPassword) {
            this.props.correctConfirmPassword();
            return true;
        }

        this.props.incorrectConfirmPassword();
        return false;
    }

    // validates whether the email is correct or not
    checkEmail(email) {
        if (email === '') {
            // this needs to be done just so that any error message above is gotten rid off
            this.props.correctEmail();
            this.props.noEmail();
            return false;
        } else if (EmailValidator.validate(email)) {
            // If the variable isValid is true then I change the border color to default color
            // and return true.
            this.props.correctEmail();
            return true;
        }

        // If the code comes to this stage then the borderColor will be set to red and false will be returned.
        // It is assumed that the if statement above didn't followed through therefore therefore the borderColor will be red and false will be returned.
        this.props.invalidEmail();

        return false;
    }

    // validate the first name by checking if the first name is an empty string which is not allowed
    checkFirstName(firstName) {
        // if the firstName is an empty string the border color remains the same
        if (firstName !== '') {
            this.props.correctFirstName();
            return true;
        }

        // otherwise if the if statement above does not get executed then the border color changes to red and an invalid text is displayed
        this.props.noFirstName();
        return false;
    }


    // validate the last name by checking if the last name is an empty string which is not allowed
    checkLastName(lastName) {
        // if the lastName is an empty string the border color remains the same
        if (lastName !== '') {
            this.props.correctLastName();
            return true;
        }

        // otherwise if the if statement above does not get executed then the border color changes to red and an invalid text is displayed
        this.props.noLastName();
        return false;
    }


    // validates whether the phone number is correct or not
    checkPhone(phone) {
        let plusCount = 0;
        let containsPlus = false

        if (phone === '') {
            // this needs to be done just so that any error message above is gotten rid off
            this.props.correctPhone();
            this.props.noPhone();
            return false;
        } else if (phone.length < 8) {
            // if the length of the phone number is less than 8 then I immedietly return false
            this.props.invalidPhone();
            return false;
        }

        for (let i = 0; i < phone.length; ++i) {
            charCode = phone[i].charCodeAt();

            // Both the expression in the if statement needs to be true in order for the statement to be true
            if (i === 0 && phone[i] === '+') {
                containsPlus = true;
                ++plusCount;
                // if the if statement above this else if doesn't get caught then this else if statement will get caught
            } else if (phone[i] === '+') {
                ++plusCount;
            }

            // If charCode is smaller than 47 or charCode is greater than 58, if either of them is true then the whole mini statement evaluates to true,
            // if both of the expression results in false then the statement is false, there can be never a scenario where it is both smaller than 47 and
            // greater than 58 at the same time so charCode can not be both smaller than 47 and greater than 58. So only when it falls within the range of
            // 47 and 58 the statement evalutes to false, as it is both not smaller than 47 and not greater than 58, which means its a number.
            if ((charCode < 47 || charCode > 58) && charCode !== 43) {
                this.props.invalidPhone();
                return false;
            }

            // + is accepted as a phone number but if the phone number has more than one + then it is not accepted
            if (plusCount == 2) {
                // If plusCount is equal to 2 I immedietly break the loop by returning false and turning the color to false.
                this.props.invalidPhone();
                return false;
            }

        }
        // if the code gets to thsi stage then the border is set to default color and true is returned
        this.props.correctPhone();
        return true
    }

    // processes the phone number by adding a + infront of the p
    processPhoneNumber(phone) {
        if (phone[0] == '+') {
            return phone;
        }
        return '+' + phone;
    }

    checkDob(dob) {
        // if dob passed as a parameter is not an empty string then the border color will remain unchanged
        if (dob !== '') {
            this.props.correctDob();
            return true;
        }

        // otherwise if the if statement above doesn't get caught then the border will change to red indicating error
        this.props.noDob();
        return false;
    }

    userNameOnEndEdits(userName) {
        // This setTimeout is absolutely necessary to allow the label animation to finish executing before
        // the entire screen can rerender again. If this setTimeout is not there then in between the animation
        // the screen will re render and the animation will appear to be laggy.
        setTimeout(() => this.userNameCheck = this.checkUserName(userName), this.animationDelay);
    }

    passwordOnEndEdits(password) {
        // This setTimeout is absolutely necessary to allow the label animation to finish executing before
        // the entire screen can rerender again. If this setTimeout is not there then in between the animation
        // the screen will re render and the animation will appear to be laggy.
        setTimeout(() => this.passwordCheck = this.checkPassword(password), this.animationDelay)
    }

    confirmPasswordOnEndEdits(confirmPassword, password) {
        // This setTimeout is absolutely necessary to allow the label animation to finish executing before
        // the entire screen can rerender again. If this setTimeout is not there then in between the animation
        // the screen will re render and the animation will appear to be laggy.
        setTimeout(() => this.confirmPasswordCheck = this.checkConfirmPassword(confirmPassword, password), this.animationDelay);
    }

    emailOnEndEdits(email) {
        // This setTimeout is absolutely necessary to allow the label animation to finish executing before
        // the entire screen can rerender again. If this setTimeout is not there then in between the animation
        // the screen will re render and the animation will appear to be laggy.
        setTimeout(() => this.emailCheck = this.checkEmail(email), this.animationDelay);
    }

    firstNameOnEndEdits(firstName) {
        // This setTimeout is absolutely necessary to allow the label animation to finish executing before
        // the entire screen can rerender again. If this setTimeout is not there then in between the animation
        // the screen will re render and the animation will appear to be laggy.
        setTimeout(() => this.firstNameCheck = this.checkFirstName(firstName), this.animationDelay);
    }

    lastNameOnEndEdits(lastName) {
        // This setTimeout is absolutely necessary to allow the label animation to finish executing before
        // the entire screen can rerender again. If this setTimeout is not there then in between the animation
        // the screen will re render and the animation will appear to be laggy.
        setTimeout(() => this.lastNameCheck = this.checkLastName(lastName), this.animationDelay);
    }

    phoneOnEndEdits(phone) {
        // This setTimeout is absolutely necessary to allow the label animation to finish executing before
        // the entire screen can rerender again. If this setTimeout is not there then in between the animation
        // the screen will re render and the animation will appear to be laggy.
        setTimeout(() => this.phoneCheck = this.checkPhone(phone), this.animationDelay);
    }

    dobOnEndEdits(dob) {
        // This setTimeout is absolutely necessary to allow the label animation to finish executing before
        // the entire screen can rerender again. If this setTimeout is not there then in between the animation
        // the screen will re render and the animation will appear to be laggy.
        setTimeout(() => this.dobCheck = this.checkDob(dob), 200);
    }


    userNameOnChangeText(userName) {
        this.props.correctUserName();
        this.props.setUserName(userName);
    }

    passwordOnChangeText(password) {
        this.props.correctPassword();
        this.props.setPassword(password);
    }

    confirmPasswordOnChangeText(confirmPassword) {
        this.props.correctConfirmPassword();
        this.props.setConfirmPassword(confirmPassword);
    }

    emailOnChangeText(email) {
        this.props.correctEmail();
        this.props.setEmail(email);
    }

    firstNameOnChangeText(firstName) {
        this.props.correctFirstName();
        this.props.setFirstName(firstName);
    }

    lastNameOnChangeText(lastName) {
        this.props.correctLastName();
        this.props.setLastName(lastName);
    }

    phoneOnChangeText(phone) {
        this.props.correctPhone();
        this.props.setPhone(phone);
    }

    dobOnChangeText(dob) {
        this.props.correctDob();
        this.props.setDob(dob);
    }


    render() {
        let registerUI = this.props.registerUI;
        let registerForm  = this.props.registerForm;

        // contains all the style props to be passed in the RegisterForm component as props
        let styleProps = {
            userNameFieldBorder: registerUI.userNameFieldBorder,
            passwordFieldBorder: registerUI.passwordFieldBorder,
            confirmPasswordFieldBorder: registerUI.confirmPasswordFieldBorder,
            emailFieldBorder: registerUI.emailFieldBorder,
            firstNameFieldBorder: registerUI.firstNameFieldBorder,
            lastNameFieldBorder: registerUI.lastNameFieldBorder,
            phoneFieldBorder: registerUI.phoneFieldBorder,
            dobFieldBorder: registerUI.dobFieldBorder
        };

        // contains all the invalid texts for label fields in the RegisterForm component to be passed down as props
        let invalidTexts = {
            invalidTextUserName: registerUI.invalidTextUserName,
            invalidTextPassword: registerUI.invalidTextPassword,
            invalidTextConfirmPassword: registerUI.invalidTextConfirmPassword,
            invalidTextEmail: registerUI.invalidTextEmail,
            invalidTextPhone: registerUI.invalidTextPhone
        }

        // Contains all the functions which encapsulates actions to what happens when the user stops providing input into the text field.
        // At the end of every text input the text inside the input is checked for validity, it it is not invalid such as weak password, no userName,
        // then the appropriate invalid UI changes will be shown.
        let onEndEdits = {
            userName: this.userNameOnEndEdits,
            password: this.passwordOnEndEdits,
            confirmPassword: this.confirmPasswordOnEndEdits,
            email: this.emailOnEndEdits,
            firstName: this.firstNameOnEndEdits,
            lastName: this.lastNameOnEndEdits,
            phone: this.phoneOnEndEdits,
            dob: this.dobOnEndEdits
        }

        // onChangeText event handler functions being passed on
        // NOTE** - It doesn't matter if these functions passed down to the children are binded to the parent
        // or not as the keyword 'this' is never used.
        let onChangeTexts = {
            userName: this.userNameOnChangeText,
            password: this.passwordOnChangeText,
            confirmPassword: this.confirmPasswordOnChangeText,
            email: this.emailOnChangeText,
            firstName: this.firstNameOnChangeText,
            lastName: this.lastNameOnChangeText,
            phone: this.phoneOnChangeText,
            dob: this.dobOnChangeText
        }

        return (
            <KeyboardAwareLayout loading = {registerUI.loading}>
                {/* Uncomment the lines below to enable spinner */}
                {/* Spinner is displayed when client is interacting with the server. */}
                {/* <Spinner visible = {registerUI.loading} color = {'purple'}/>*/}


                {/* The defaultRegisterForm props is the initial state of the register.registerForm attribute from the store's state object. */}
                <RegisterForm
                    onEndEdits = {onEndEdits}
                    onChangeTexts = {onChangeTexts}
                    invalidTexts = {invalidTexts}
                    defaultRegisterForm = {registerForm}
                    style = {styleProps}
                    dob = {registerUI.date}
                    onSubmit = {this.onSubmit}
                    formChecks = {this.formChecks}
                />
                <SubmitButton isLoading = {registerUI.loading} onSubmit = {() => this.onSubmit(registerForm)}/>
            </KeyboardAwareLayout>
        );
    }
}

// Redux is managing two different application's state. The first is Tinant app's state and the second is the react-navigation
// module's state. Both of these store's states are passed down through parameters to this function.
// I extract both the attributes from react-navigation module state and pass it to the RegisterContainer.
// The Tinant app's state will also be passed down to this function by Redux and then I filter the store's Tinant app state
// by extracting only two attributes from the state object which is the register part and the navigatorStack which
// contains all the scenes in the react navigation in a stack and pass it to the RegisterContainer props. This is the entire purpose of this function.
const mapStateToProps = (appState, navigationState) => {
    return {
        navigation: navigationState.navigation,
        screenProps: navigationState.screenProps,
        navigatorStack: appState.navigatorStack,
        registerUI: appState.registerUI,
        registerForm: appState.registerForm
    }
};


// Redux will pass the dispatch function to this function as a parameter and I simply return an object, which will have
// attributes as the dispatched action. Remember the Redux store's data is mutated, by calling the dispatch function with
// a action function passed in it. This is exactly whats happening here. This object attributes get passed down to the RegisterContainer
// component as a prop and the component can simply call the function from this.prop.displayDate(date);
const mapDispatchToProps = dispatch => {
    return {
        // All these functions below can be accessed by this component using this.props.functionName(parameterIfAny).
        // All these functions now available in the props will directly invoke Redux's dispatch function. Notice that each action
        // creators from the action file is actually being invoked first and then being passed inside as a parameter to
        // dispatch. As JavaScript follows applicative order of evaluation, this is possible, since most of the action
        // creators return an object all that's happening is that we are just passing an object inside the dispatch function.
        noUserName: () => dispatch(actions.noUserName()),
        userNameExists: () => dispatch(actions.userNameExists()),
        weakPassword: () => dispatch(actions.weakPassword()),
        noPassword: () => dispatch(actions.noPassword()),
        incorrectConfirmPassword: () => dispatch(actions.incorrectConfirmPassword()),
        noConfirmPassword: () => dispatch(actions.noConfirmPassword()),
        invalidEmail: () => dispatch(actions.invalidEmail()),
        noEmail: () => dispatch(actions.noEmail()),
        emailExists: () => dispatch(actions.emailExists()),
        noFirstName: () => dispatch(actions.noFirstName()),
        noLastName: () => dispatch(actions.noLastName()),
        invalidPhone: () => dispatch(actions.invalidPhone()),
        noPhone: () => dispatch(actions.noPhone()),
        noDob: () => dispatch(actions.noDob()),
        // NOTE** - The userName parameter needs to be provided by the scope that is invoking this function.
        setUserName: (userName) => dispatch(actions.setUserName(userName)),
        setPassword: (password) => dispatch(actions.setPassword(password)),
        setConfirmPassword: (confirmPassword) => dispatch(actions.setConfirmPassword(confirmPassword)),
        setEmail: (email) => dispatch(actions.setEmail(email)),
        setFirstName: (firstName) => dispatch(actions.setFirstName(firstName)),
        setLastName: (lastName) => dispatch(actions.setLastName(lastName)),
        setPhone: (phone) => dispatch(actions.setPhone(phone)),
        setDob: (dob) => dispatch(actions.setDob(dob)),
        clearRegisterUIChanges: () => dispatch(actions.clearRegisterUIChanges()),
        correctUserName: () => dispatch(actions.correctUserName()),
        correctPassword: () => dispatch(actions.correctPassword()),
        correctConfirmPassword: () => dispatch(actions.correctConfirmPassword()),
        correctEmail: () => dispatch(actions.correctEmail()),
        correctFirstName: () => dispatch(actions.correctFirstName()),
        correctLastName: () => dispatch(actions.correctLastName()),
        correctPhone: () => dispatch(actions.correctPhone()),
        correctDob: () => dispatch(actions.correctDob()),
        saveRegisterForm: (registerForm) => dispatch(actions.saveRegisterForm(registerForm)),
        clearRegisterForm: () => dispatch(actions.clearRegisterForm()),
        postRegisterForm: (registerForm) => dispatch(actions.postRegisterForm(registerForm)),
        showToast: (message) => dispatch(ToastActionsCreators.displayInfo(message, this.toastTime))
    }
};

// Since its a export default, wherever its being imported it can be named and aliased by whatever variable at that scope.
// The function connect is a closure function which takes in two parameters and returns
export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
