// combines all the reducers and exports a root reducer

// NOTE** - Each reducer function or file, will represent one single attribute of the giant state of the entire application
//          saved by Redux itself. Using these reducers, we will be manipulating each individual attributes of the store.

import { combineReducers } from 'redux';
import navigatorStack from './navigatorStack';
import { toastReducer as toast } from 'react-native-redux-toast';
import registerUI from './registerUI';
import registerForm from './registerForm';
import loginUI from './loginUI';
import loginForm from './loginForm';
import loginStatus from './loginStatus';

export default combineReducers({
    navigatorStack,
    toast,
    registerUI,
    registerForm,
    loginUI,
    loginForm,
    loginStatus
});
