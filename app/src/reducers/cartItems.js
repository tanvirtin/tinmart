// reducer will contain a state and will be an attribute in the redux store's state and will be responsible
// for containing a single array, this array will contain the list of products that are added to the cart

// This will be the data store for all the cartItems

import {
    ADD_CART_ITEM,
    REMOVE_CART_ITEM,
    EMPTY_CART_ITEMS
} from '../constants/actionTypes';


// This object will contain an array which contains all the product ids
const initialState = {
    products: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_CART_ITEM:
            let newProducts = state.products;
            const product = action.product;
            newProducts.push(product);
            // deep copy the old object and create a new one and update the old product array with the new product array
            return {...state, product: newProducts}
        
        // when the EMPTY_CART_ITEMS action gets fired the initialState is returned with the empty cart list
        case EMPTY_CART_ITEMS:
            return initialState;

        // by default the unchange current state is returned
        default:
            return state;
    }
}