// reducer will contain a state and will be an attribute in the redux store's state and will be responsible
// for containing a single array, this array will contain the list of products that are added to the cart

// This will be the data store for all the cartItems

import {

} from '../constants/actionTypes';


// This object will contain an array which contains all the products
const initialState = {
    products: []
}

export default (state = initialState, action) => {
    switch(action.type) {

        // by default the unchange current state is returned
        default:
            return state;
    }
}