// reducer state will contain all the register form data which will be sent to the server

import {
    SAVE_REGISTER_FORM,
    CLEAR_REGISTER_FORM,
    SET_USERNAME_REGISTER,
    SET_PASSWORD_REGISTER,
    SET_CONFIRM_PASSWORD,
    SET_EMAIL,
    SET_FIRST_NAME,
    SET_LAST_NAME,
    SET_PHONE,
    SET_DOB
} from '../constants/actionTypes';

const initialState = {
    userName: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dob: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SAVE_REGISTER_FORM:
            // The whole state of the reducer gets replaced by the one single payload in the action.
            // All the attributes of action.registerForm gets copied over to the reducer's state and
            // that state gets replaced by action.registerForm using deep copy.
            return {...action.registerForm};

        case CLEAR_REGISTER_FORM:
            return {...initialState};
            case SET_USERNAME_REGISTER:
                // Return an object which is a deep copy of the current state with the userName attribute changed to the
                // userName attribute in action.
                return {...state, userName: action.userName};

            case SET_PASSWORD_REGISTER:
                return {...state, password: action.password};

            case SET_CONFIRM_PASSWORD:
                return {...state, confirmPassword: action.confirmPassword};

            case SET_EMAIL:
                return {...state, email: action.email};

            case SET_FIRST_NAME:
                return {...state, firstName: action.firstName};

            case SET_LAST_NAME:
                return {...state, lastName: action.lastName};

            case SET_PHONE:
                return {...state, phone: action.phone};

            case SET_DOB:
                return {...state, dob: action.dob};
        // by default the unchanged current state is returned
        default:
            return state;
    }
}
