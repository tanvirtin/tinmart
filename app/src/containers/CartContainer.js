// Smart container component

import React, { Component } from 'react';

import { DefaultLayout } from '../components/DefaultLayout';

import { CartCard } from '../components/CartCard';

import { SubmitButton } from '../components/SubmitButton';

import { connect } from 'react-redux';

import {
    BackHandler,
    Button
} from 'react-native';

import { NavigationActions } from 'react-navigation';

// Imports all action functions as an actions object
import * as actions from '../actions/cart'

// json file that contains basic information about the app such as name and theme color
const appInfo = require('../../appInfo.json');

class CartContainer extends Component {

    constructor(props) {
        super(props);
        this.onMenuPress = this.onMenuPress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.checkout = this.checkout.bind(this);
        // will contain the CartCard dumb components
        this.cartCards = []
    }

    // REFACTOR
    async componentDidMount() {
        // attach the back event handler
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

        // will accumulate the cartCards
        let cartCardsAccumulator = [];

        // I am making the server requests in componentDidMount because I want to show the loading process in retrieving the requests
        // even though it could have been done in componentWillMount, its not too big of a deal
        productIds = this.props.cartItems.products;

        try {
            for (let i = 0; i < productIds.length; i++) {
                const productId = productIds[i];
                const response = await this.props.getProduct(productId);

                const status = response.status;
                // if status is greater than 201 means there was an error
                if (status > 201) {
                    break;
                } else {
                    const product = response.data;

                    const cartCard = <CartCard key = {i} img = {product.productImgUrl} title = {product.title} price = {product.price}/>

                    // add the component created to the cartCards array
                    cartCardsAccumulator.push(cartCard);
                }
            }
            this.cartCards = cartCardsAccumulator;

            this.props.showCards();
        } catch (err) {
            // REFACTOR
            // SHOW ERROR MESSAGE
        }

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

    // REFACTOR later
    async checkout() {
        const products = this.props.cartItems;
        const response = await this.props.checkout(products, this.props.emptyCart);
        if (response.status < 202) {
            this.props.hideCards();
        }
    }

    render() {
        let loading = this.props.cartUI.loading;
        let cartItemFound = false;
        let cartItemsInitial = false;

        // if no cards then don't display button
        if (this.cartCards.length !== 0) {
            cartItemsInitial = true;
        }

        // if no cart items then don't display button or cards
        if (this.props.cartItems.products.length !== 0) {
            cartItemFound = true;
        }


        return (
            <DefaultLayout
                onMenuPress = {this.onMenuPress}
            >
            {cartItemFound && this.cartCards}
            {cartItemFound && cartItemsInitial && <SubmitButton name = {'Checkout'} isLoading = {loading} onSubmit = {this.checkout}/>}
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
    cartUI: appState.cartUI
})

const mapDispatchToProps = dispatch => ({
    getProduct: (productId) => dispatch(actions.getProduct(productId)),
    showCards: () => dispatch(actions.showCards()),
    hideCards: () => dispatch(actions.hideCards()),
    checkout: (products, action) => dispatch(actions.checkout(products, action)),
    emptyCart: () => dispatch(actions.emptyCart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartContainer);
