// reducer state will contain all the dynamic UI changes

import {
    CORRECT_USERNAME_REGISTER,
    CORRECT_PASSWORD_REGISTER,
    CORRECT_CONFIRM_PASSWORD,
    CORRECT_EMAIL,
    CORRECT_FIRST_NAME,
    CORRECT_LAST_NAME,
    CORRECT_PHONE,
    CORRECT_DOB,
    NO_USERNAME_REGISTER,
    USERNAME_EXISTS,
    WEAK_PASSWORD,
    NO_PASSWORD_REGISTER,
    INCORRECT_CONFIRM_PASSWORD,
    NO_CONFIRM_PASSWORD,
    INVALID_EMAIL,
    NO_EMAIL,
    EMAIL_EXISTS,
    NO_FIRST_NAME,
    NO_LAST_NAME,
    INVALID_PHONE,
    NO_DOB,
    CLEAR_REGISTER_UI_CHANGES,
    NO_PHONE,
    REGISTER_LOADING_ON,
    REGISTER_LOADING_OFF,
} from '../constants/actionTypes';

// This object will contain all the default states for the Register view's user interface.
const initialState = {
    loading: false,
    userNameFieldBorder: '#dddddd',
    passwordFieldBorder: '#dddddd',
    confirmPasswordFieldBorder: '#dddddd',
    emailFieldBorder: '#dddddd',
    firstNameFieldBorder: '#dddddd',
    lastNameFieldBorder: '#dddddd',
    phoneFieldBorder: '#dddddd',
    dobFieldBorder: '#dddddd',
    invalidTextUserName: '',
    invalidTextPassword: '',
    invalidTextConfirmPassword: '',
    invalidTextEmail: '',
    invalidTextPhone: ''
}

export default (state = initialState, action) => {
    switch (action.type) {

        case REGISTER_LOADING_ON:
            // The syntax {...state} copies all the attributes of the state and creates a new duplicate object with a deep copy
            // then the loading attribute of the object is changed and assigned to whatever action's loading attribute is.
            return {...state, loading: true}

        case REGISTER_LOADING_OFF:
            return {...state, loading: false}

        case CORRECT_USERNAME_REGISTER:
            return {...state, userNameFieldBorder: action.defaultBorderColor, invalidTextUserName: ''};

        case CORRECT_PASSWORD_REGISTER:
            return {...state, passwordFieldBorder: action.defaultBorderColor, invalidTextPassword: ''};

        case CORRECT_CONFIRM_PASSWORD:
            return {...state, confirmPasswordFieldBorder: action.defaultBorderColor, invalidTextConfirmPassword: ''};

        case CORRECT_EMAIL:
            return {...state, emailFieldBorder: action.defaultBorderColor, invalidTextEmail: ''};

        case CORRECT_FIRST_NAME:
            return {...state, firstNameFieldBorder: action.defaultBorderColor};

        case CORRECT_LAST_NAME:
            return {...state, lastNameFieldBorder: action.defaultBorderColor};

        case CORRECT_PHONE:
            return {...state, phoneFieldBorder: action.defaultBorderColor, invalidTextPhone: ''};

        case CORRECT_DOB:
            return {...state, dobFieldBorder: action.defaultBorderColor};

        case NO_USERNAME_REGISTER:
            return {...state, userNameFieldBorder: action.incorrectBorderColor};

        case USERNAME_EXISTS:
            return {...state, userNameFieldBorder: action.incorrectBorderColor, invalidTextUserName: action.invalidTextUserName};

        case WEAK_PASSWORD:
            return {...state, passwordFieldBorder: action.incorrectBorderColor, invalidTextPassword: action.invalidTextPassword};

        case NO_PASSWORD_REGISTER:
            return {...state, passwordFieldBorder: action.incorrectBorderColor}

        case INCORRECT_CONFIRM_PASSWORD:
            return {...state, confirmPasswordFieldBorder: action.incorrectBorderColor, invalidTextConfirmPassword: action.invalidTextConfirmPassword};

        case NO_CONFIRM_PASSWORD:
            return {...state, confirmPasswordFieldBorder: action.incorrectBorderColor}

        case INVALID_EMAIL:
            return {...state, emailFieldBorder: action.incorrectBorderColor, invalidTextEmail: action.invalidTextEmail};

        case NO_EMAIL:
            return {...state, emailFieldBorder: action.incorrectBorderColor};

        case EMAIL_EXISTS:
            return {...state, emailFieldBorder: action.incorrectBorderColor, invalidTextEmail: action.invalidTextEmail};

        case NO_FIRST_NAME:
            return {...state, firstNameFieldBorder: action.incorrectBorderColor};

        case NO_LAST_NAME:
            return {...state, lastNameFieldBorder: action.incorrectBorderColor};

        case INVALID_PHONE:
            return {...state, phoneFieldBorder: action.incorrectBorderColor, invalidTextPhone: action.invalidTextPhone};

        case NO_PHONE:
            return {...state, phoneFieldBorder: action.incorrectBorderColor};

        case NO_DOB:
            return {...state, dobFieldBorder: action.incorrectBorderColor};

        // clear the UI changes by coping over the inital state and making a new object and returning it
        case CLEAR_REGISTER_UI_CHANGES:
            return {...initialState};

        // by default the unchanged current state is returned
        default:
            return state;
    }

}
