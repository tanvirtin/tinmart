// reducer state will contain the all the search data needed for the home page

import {
    STORE_TERM,
    CLEAR_TERM
} from '../constants/actionTypes';

// this object will contain all the data related to search and query for the home page
const initialState = {
    term: ''
}

export default (state = initialState, action) => {
    switch (action.type) {

        // copy over the original state using deep copy and then the term attribute will
        // be changed to the term attribute provided in the action
        case STORE_TERM:
            return {...state, term: action.term}

        // on CLEAR_TERM action simply reassign the state to its initial state
        case CLEAR_TERM:
            return initialState;

        // by default the state is always returned
        default:
            return state;

    }
}