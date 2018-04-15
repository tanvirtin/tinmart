// Smart container component

import React, { Component } from 'react';

import { SearchLayout } from '../components/SearchLayout';
import { ActivitySpinner } from '../components/ActivitySpinner';
import { InvalidSearch } from '../components/InvalidSearch';
import { BasicItemCard } from '../components/BasicItemCard';

import { connect } from 'react-redux';

import { BackHandler } from 'react-native';

// Imports all action functions as an actions object
import * as actions from '../actions/home';

class HomeContainer extends Component {

    /**
     * Constructor for the smart container HomeComponent
     * @param props The props that gets passed down to this component by its parent component
     */
    constructor(props) {
        // construct the base class passing the props parameter passed in through the constructor of the sub class
        super(props);

        // these functions need to be bounded so that the keyword 'this' belongs to the HomeContainer class scope
        // when these functions will be passed to their children which have a different scope
        this.onMenuPress = this.onMenuPress.bind(this);

        // the onBackPress method needs to be binded to the scope of the component class
        // so that the keyword this can refer to the class the method belongs to despite being
        // passed into different scopes
        this.onBackPress = this.onBackPress.bind(this);

        // the HomeContainer scope 'this' needs to be binded to the function searchBarOnEndEditing
        // as this function will get passed to a different scope and it will still access the HomeContainer scope using this keyword
        this.searchBarOnEndEditing = this.searchBarOnEndEditing.bind(this);

        // the HomeContainer scope 'this' needs to be binded to the function searchBarOnChangeText
        // as this function will get passed to a different scope and it will still access the HomeContainer scope using this keyword
        this.searchBarOnChangeText = this.searchBarOnChangeText.bind(this);

        // the HomeContainer scope 'this' needs to be binded to the function onAddToCart
        // as this function will get passed to a different scope and it will still access the HomeContainer scope using this keyword
        this.onAddToCart = this.onAddToCart.bind(this);

        // the HomeContainer scope 'this' needs to be binded to the function onCartPress
        // as this function will get passed to a different scope and it will still access the HomeContainer scope using this keyword
        this.onCartPress = this.onCartPress.bind(this);

        // the HomeContainer scope 'this' needs to be binded to the function onViewProduct
        // as this function will get passed to a different scope and it will still access the HomeContainer scope using this keyword
        this.onViewProduct = this.onViewProduct.bind(this);

        // keep a list of basic card items
        this.basicCardItems = [];

        // keep a list of products found
        this.listOfProducts = [];
    }

    /**
     * React life cycle event handler that gets triggered when the component has finished rendering.
     * Upon finishing the rendering a back button event handler is attached.
     */
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    /**
     * React life cycle event handler that gets triggered when the component is about to get unmounted from the view.
     * Detach the hardware back button handler on component did mount when the component is unmounting/
     */
    componentWillUnmount() {
        // on component will unmount the search term stored in the store as an attribute of the reducer state homeSearch
        // which is an object which is an attribute of the store's state itself gets cleard out
        this.props.clearTerm();
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    /**
     * A function that gets triggered when the back hardware button is pressed
     */
    onBackPress() {
        this.props.navigation.navigate('DrawerClose');
        // when true is returned in the back handler function you don't exit the app
        // when false is returned you exit the app
        return true;
    }

    /**
     * Event handler that gets invoked when the menu button is pressed, this function opens the drawer.
     */
    onMenuPress() {
        this.props.navigation.navigate('DrawerOpen');
    }

    /**
     * A function that gets invoked everytime the text changes inside a text field
     * @param text the string that gets passed by the input box to this funciton, this string represents the string currently in the input box on change text
     */
    searchBarOnChangeText(text) {
        // on change text the action to store the term gets invoked
        this.props.storeTerm(text);
        this.props.productFound();
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

    /**
     * Views the product on click
     */
    onViewProduct(product) {
        this.props.viewProduct(product);
        this.props.navigation.navigate('Product');
    }

    /**
     * A function that gets invoked when the enter button is pressed on the keyboard after you finish typing something inside the input box
     */
    async searchBarOnEndEditing() {
        this.props.productFound();
        // empty out the list so that the old card items get removed to make room for the new one
        this.basicCardItems = [];
        // the term in the input box is the query with which the get request to the server is send
        const term = this.props.homeSearch.term;

        try {
            // make the get request by attaching the term to the string
            const response = await this.props.submitSearch(term);
            
            const status = response.status;

            // if the status is greater than 201 then it means the server returned an error
            if (status > 201) {
                const errorMessage = resJson.message;
                // display the message that product not found
                this.props.noProductFound();
            } else {
                // else we succeeded in getting a positive response
                const resObject = response.data;

                const resJson = JSON.parse(resObject);
                
                this.listOfProducts = resJson.products;

                for (let i = 0; i < this.listOfProducts.length; ++i) {
                    const product = this.listOfProducts[i];

                    // a procedure which takes in no parameters as onPress event handler functions do not take any parameters
                    // then this function binds i from the scope that it gets defined in which is searchBarOnEndEditing functions scope!
                    // THIS IS LEXICAL SCOPING and therefore basicCardItemIndex is the i in the for loop that gets passed inside another scope
                    // REMEMBER onAddToCart item is binded to the scope of the HomeContainer, now this procedure gets passed to the scope of another component to be invoked on press.
                    // now this basicCardItemIndex can be used to access the this.basicCardItems's index defined in HomeContainer's scope.
                    const onAddToCartButtonBinder = () => {
                        const basicCardItemIndex = i;
                        this.onAddToCart(basicCardItemIndex);
                    }

                    const basicCardItem = <BasicItemCard key = {i} onPress = {() => this.onViewProduct(product.docId)} onAddToCart = {onAddToCartButtonBinder} title = {product.title} category = {product.category} productImg = {product.productImgUrl} price = {product.price}/>
                    this.basicCardItems.push(basicCardItem);
                }

                // display the message that product was found
                this.props.productFound();
            }
        } catch (err) {
            this.props.noProductFound();
        }
    }

    /**
     * This function will get invoked everytime react updates its DOM (Document Object Model)
     */
    render() {
        // here loading being const doesn't matter because render method is invoked when this.props.homeUI changes
        // when it does change the variable loading gets destroyed from memory as the previous render function no longer exists in stack,
        // as the new render function gets indexed in the callstack again the const loading gets recreated.
        const loading = this.props.homeUI.loading;
        const productNotFound = this.props.homeUI.productNotFound;
        const basicCardItems = this.basicCardItems;
        // number of products in the cart is taken out from the cartItems reducer's state
        const numberOfProductsInCart = this.props.cartItems.products.length;

        // this boolean will indicate if the cart badge gets shown or not
        let displayBadge = false;
        // if the numberOfProductsInCart retrieved via the products retrieved from the redux store is not 0 then we display the badge
        if (numberOfProductsInCart !== 0) {
            displayBadge = true;
        }

        return (
            <SearchLayout
                onMenuPress = {this.onMenuPress}
                onCartPress = {this.onCartPress}
                title = {'Home'}
                searchBarOnEndEditing = {this.searchBarOnEndEditing}
                searchBarOnChangeText = {this.searchBarOnChangeText}
                showBadge = {displayBadge}
                numCartItems = {numberOfProductsInCart}
            >
                {/* This is saying that if homeUI.loading is true then only render this element */}
                {loading && <ActivitySpinner/>}
                {/* This is saying that if homeUI.productNotFound is true then only render this element */}
                {productNotFound && <InvalidSearch message = {'product not found'}/>}
                {!productNotFound && basicCardItems}
            </SearchLayout>
        );
    }
}

/**
 * Function returns an object which gets passed inside connect, this allows the props object to contain attributes of the object attributes returned by this function
 * @param appState an object which has all the redux states as attributes
 * @param navigationState contains an object which has all the navigator stack states
 * @return returns an object which gets passed inside connect, this allows the props object to contain attributes of the object attributes returned by this function
 */
 const mapStateToProps = (appState, navigationState) => ({
    navigation: navigationState.navigation,
    screenProps: navigationState.screenProps,
    navigatorStack: appState.navigatorStack,
    homeUI: appState.homeUI,
    homeSearch: appState.homeSearch,
    // will contain all products in the cartItem
    cartItems: appState.cartItems
});

/**
 * Fnction returns an object which gets passed inside connect, this allows the props object to contain attributes of the attributes object returned by the function
 * @param dispatch The dispatch attribute is the dispatch function that is used to check all the reducers in Redux for a given action
 * @return returns an object which gets passed inside connect, this allows the props object to contain attributes of the attributes object returned by the function
 */
const mapDispatchToProps = dispatch => ({
    submitSearch: term => dispatch(actions.submitSearch(term)),
    storeTerm: term => dispatch(actions.storeTerm(term)),
    clearTerm: () => dispatch(actions.clearTerm()),
    noProductFound: () => dispatch(actions.noProductFound()),
    productFound: () => dispatch(actions.productFound()),
    // action takes in an argument called product which the json object from the server
    addCartItem: product => dispatch(actions.addCartItem(product)),
    viewProduct: product => dispatch(actions.viewProduct(product))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
