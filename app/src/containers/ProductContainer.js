// Smart container component

import React, { Component } from 'react';

import { DefaultLayout } from '../components/DefaultLayout';

import { BasicItemCard } from '../components/BasicItemCard';

import { ActivitySpinner } from '../components/ActivitySpinner';

import { connect } from 'react-redux';

import { BackHandler, Button } from 'react-native';

import { NavigationActions } from 'react-navigation';

// Imports all action functions as an actions object
import * as actions from '../actions/product'

class ProductContainer extends Component {

    constructor(props) {
        super(props);
        this.onMenuPress = this.onMenuPress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onAddToCart = this.onAddToCart.bind(this);
        this.onCartPress = this.onCartPress.bind(this);
 
        // keep a list of products found
        this.listOfProducts = [];
    }

    async componentDidMount() {
        // attach the back event handler
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillMount() {
        // remove the back event handler
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress() {
        // the function that gets attached to the back event handler and gets invoked everytime you press the back button which takes you back to the previous screen
        this.props.navigation.dispatch(NavigationActions.back());
        return true;
    }

    onMenuPress() {
        // open the drawer when the menu button is pressed
        this.props.navigation.navigate('DrawerOpen');
    }

    /**
     * @param itemIndex the index which with which the this.basicCardItems array gets accessed
     */
    onAddToCart(itemIndex) {
        // remember the index for the basicCardItems array is THE SAME AS THE index in the lsit of products returned by the server
        // as the list of products are essentially getting mapped into the basicCardItems array and this.listOfProducts can be accessed
        // from this function as onAddToCart is binded to the HomeContainer scope
        const product = this.listOfProducts[itemIndex];

        // now this product needs to be added to the redux store to build cards for the cart items view container component instead of passing props down
        this.props.addCartItem(product.docId);
    }

    /**
     * Button event handler method that gets passed inside the scope of SearchLayout component where when you click on the
     * cart icon you go to page filled with items
     */
    onCartPress() {
        this.props.navigation.navigate('Cart');
    }


    render() {
        let loading = this.props.productUI.loading;
        // number of products in the cart is taken out from the cartItems reducer's state
        const numberOfProductsInCart = this.props.cartItems.products.length;

        // this boolean will indicate if the cart badge gets shown or not
        let displayBadge = false;
        // if the numberOfProductsInCart retrieved via the products retrieved from the redux store is not 0 then we display the badge
        if (numberOfProductsInCart !== 0) {
            displayBadge = true;
        }
        
        return (
            <DefaultLayout
                onMenuPress = {this.onMenuPress}
                showCart = {true}
                onCartPress = {this.onCartPress}
                showBadge = {displayBadge}
                numCartItems = {numberOfProductsInCart}
            >
            {/* This is saying that if homeUI.loading is true then only render this element */}
            {loading && <ActivitySpinner/>}
            </DefaultLayout>
        );
    }

}

const mapStateToProps = (appState, navigationState) => ({
    navigation: navigationState.navigation,
    screenProps: navigationState.screenProps,
    navigatorStack: appState.navigatorStack,
    // will contain all products in the cartItem
    cartItems: appState.cartItems,
    productUI: appState.productUI
})

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ProductContainer);