// will contain all possible redux actions related to the register view

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
    NO_PHONE,
    NO_DOB,
    SET_USERNAME_REGISTER,
    SET_PASSWORD_REGISTER,
    SET_CONFIRM_PASSWORD,
    SET_EMAIL,
    SET_FIRST_NAME,
    SET_LAST_NAME,
    SET_PHONE,
    SET_DOB,
    CLEAR_REGISTER_UI_CHANGES,
    SAVE_REGISTER_FORM,
    CLEAR_REGISTER_FORM,
    REGISTER_LOADING_ON,
    REGISTER_LOADING_OFF
} from '../constants/actionTypes';

import { post } from './ajaxRequests';

export const correctUserName = () => ({
        type: CORRECT_USERNAME_REGISTER,
        defaultBorderColor: '#dddddd'
    }
);

export const correctPassword = () => ({
        type: CORRECT_PASSWORD_REGISTER,
        defaultBorderColor: '#dddddd'
    }
);

export const correctConfirmPassword = () => ({
        type: CORRECT_CONFIRM_PASSWORD,
        defaultBorderColor: '#dddddd'
    }
);

export const correctEmail = () => ({
        type: CORRECT_EMAIL,
        defaultBorderColor: '#dddddd'
    }
);

export const correctFirstName = () => ({
    type: CORRECT_FIRST_NAME,
    defaultBorderColor: '#dddddd'
});

export const correctLastName = () => ({
    type: CORRECT_LAST_NAME,
    defaultBorderColor: '#dddddd'
});

export const correctPhone = () => ({
        type: CORRECT_PHONE,
        defaultBorderColor: '#dddddd'
    }
);

export const correctDob = () => ({
    type: CORRECT_DOB,
    defaultBorderColor: '#dddddd'
});

export const noUserName = () => ({
        type: NO_USERNAME_REGISTER,
        incorrectBorderColor: 'red'
    }
);

export const userNameExists = () => ({
    type: USERNAME_EXISTS,
    incorrectBorderColor: 'red',
    invalidTextUserName: 'Username already exists'
});

export const weakPassword = () => ({
        type: WEAK_PASSWORD,
        incorrectBorderColor: 'red',
        invalidTextPassword: 'Weak password'
    }
);

export const noPassword = () => ({
    type: NO_PASSWORD_REGISTER,
    incorrectBorderColor: 'red'
});

export const incorrectConfirmPassword = () => ({
        type: INCORRECT_CONFIRM_PASSWORD,
        incorrectBorderColor: 'red',
        invalidTextConfirmPassword: 'Passwords don\'t match'
    }
);

export const noConfirmPassword = () => ({
    type: NO_CONFIRM_PASSWORD,
    incorrectBorderColor: 'red'
});

export const invalidEmail = () => ({
        type: INVALID_EMAIL,
        incorrectBorderColor: 'red',
        invalidTextEmail: 'Invalid email address'
    }
);

export const noEmail = () => ({
    type: NO_EMAIL,
    incorrectBorderColor: 'red'
});

export const emailExists = () => ({
    type: EMAIL_EXISTS,
    incorrectBorderColor: 'red',
    invalidTextEmail: 'Email already exists'
});

export const noFirstName = () => ({
    type: NO_FIRST_NAME,
    incorrectBorderColor: 'red'
});

export const noLastName = () => ({
    type: NO_LAST_NAME,
    incorrectBorderColor: 'red'
});

export const invalidPhone = () => ({
        type: INVALID_PHONE,
        incorrectBorderColor: 'red',
        invalidTextPhone: 'Invalid phone number'
    }
);

export const noPhone = () => ({
    type: NO_PHONE,
    incorrectBorderColor: 'red'
});

export const noDob = () => ({
    type: NO_DOB,
    incorrectBorderColor: 'red'
});

// The actionCreator will take a username as a parameter which will a payload for the action
// and the type will be SET_USERNAME_REGISTER. Whenever the reducer related to this data will
// get this object it will use the object returned by the function to manipulate the store in redux.
// The reducer needs this action object to manipulate the data.
export const setUserName = userName => ({
    type: SET_USERNAME_REGISTER,
    userName
});

export const setPassword = password => ({
    type: SET_PASSWORD_REGISTER,
    password
});

export const setConfirmPassword = confirmPassword => ({
    type: SET_CONFIRM_PASSWORD,
    confirmPassword
});

export const setEmail = email => ({
    type: SET_EMAIL,
    email
});

export const setFirstName = firstName => ({
    type: SET_FIRST_NAME,
    firstName
});


export const setLastName = lastName => ({
    type: SET_LAST_NAME,
    lastName
});


export const setPhone = phone => ({
    type: SET_PHONE,
    phone
});


export const setDob = dob => ({
    type: SET_DOB,
    dob
});

export const clearRegisterUIChanges = () => ({
    type: CLEAR_REGISTER_UI_CHANGES
});

export const saveRegisterForm = (registerForm) => ({
        type: SAVE_REGISTER_FORM,
        // instead of writing registerForm: registerForm I am using the ES6 syntax
        registerForm
    }
);

export const clearRegisterForm = () => ({
    type: CLEAR_REGISTER_FORM
});

export const loadingOn = () => ({
    type: REGISTER_LOADING_ON
});

export const loadingOff = () => ({
    type: REGISTER_LOADING_OFF
});

// using a single line arrow function will automatically invoke the keyword return which returns a promise returned by the post function
export const postRegisterForm = registerForm => post('accounts/register-user', registerForm, {
    // the loadingOn action is passed inside the object using ES6 syntax, which is equivalent to loadingOn: loadingOn
    loadingOn,
    // the loadingOff action is passed inside the object using ES6 syntax, which is equivalent to loadingOff: loadingOff
    loadingOff
});
