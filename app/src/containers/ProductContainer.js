// Smart container component

import React, { Component } from 'react';

import { DefaultLayout } from '../components/DefaultLayout';

import { BasicItemCard } from '../components/BasicItemCard';

import { ActivitySpinner } from '../components/ActivitySpinner';

import { connect } from 'react-redux';

import { 
    BackHandler, 
    Button,
    ListView,
    Text
} from 'react-native';

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
 
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.product = this.props.productUI.productCurrentlyViewed;

        this.similarProducts = this.ds.cloneWithRows([]);

        this.complementaryProducts = this.ds.cloneWithRows([]);

        this.similar = false;
        this.comp = false;
    }

    async componentDidMount() {
        // attach the back event handler
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

        // make ajax request to get the product
        let response = await this.props.getProduct(this.product);

        let status = response.status;

        let product = {};
        if (status < 201) {
            product = response.data;
        } else {
            return;
        }
        
        response = await this.props.getRecommendations(this.product);        
        status = response.status;

        if (status < 201) {
            // get the response json object after parsing
            responseObject = JSON.parse(response.data);
            
            // destruct the object to get the attributes of the object
           let { similarProducts, complementaryProducts } = responseObject;

            similarProductNames = []

            for (let i = 0; i < similarProducts.length; ++i) {
                let title = '';
                if (i !== similarProducts.length - 1) {
                    title = similarProducts[i].title + ', ';
                } else {
                    title = similarProducts[i].title;
                }
                similarProductNames.push(title);
            }

            this.similarProducts = this.ds.cloneWithRows(similarProductNames);


            complementaryProductNames = []

            for (let i = 0; i < complementaryProducts.length; ++i) {
                let title = '';
                if (i !== complementaryProducts.length - 1) {
                    title = complementaryProducts[i].title + ', ';
                } else {
                    title = complementaryProducts[i].title;
                }
                complementaryProductNames.push(title);
            }

            this.complementaryProducts = this.ds.cloneWithRows(complementaryProductNames);

            if (similarProducts.length !== 0) {
                this.similar = true;
            }

            if (complementaryProducts.length !== 0) {
                this.comp = true;
            }


            this.productCard = <BasicItemCard productView onAddToCart = {() => this.onAddToCart(product)} title = {product.title} category = {product.category} productImg = {product.productImgUrl} price = {product.price}/>
        } else {
            return;
        }

       this.props.removeProduct();
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
    onAddToCart(product) {
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
            {this.productCard}
            
            
            {
                /**
                 * 
                 * MAJOR REFACTORING NEEDS TO BE DONE HERE
                 * 
                 */
            }
            
            
            {this.similar && <Text> Similar Products: </Text>}
                <ListView style = {styles.similar}
                    horizontal = {true}
                    dataSource = {this.similarProducts}
                    renderRow = {(rowData) => <Text>{rowData}</Text>}
                    enableEmptySections={true}
                />
            {this.comp && <Text> Complementary Products: </Text> }                
                <ListView style = {styles.complementary}
                    horizontal = {true}
                    dataSource = {this.complementaryProducts}
                    renderRow = {(rowData) => <Text>{rowData}</Text>}
                    enableEmptySections={true}
                />
            
            </DefaultLayout>
        );
    }

}

// Stylesheet.create() must not be used as a plain JavaScript object is not returned and for performance optimization
// a pure JavaScript object must be assigned to components as props
const styles = {
    similar: {
        paddingTop: '2%',
        height: 50,
    },
    complementary: {
        height: 50
    }
};

const mapStateToProps = (appState, navigationState) => ({
    navigation: navigationState.navigation,
    screenProps: navigationState.screenProps,
    navigatorStack: appState.navigatorStack,
    // will contain all products in the cartItem
    cartItems: appState.cartItems,
    productUI: appState.productUI,
})

const mapDispatchToProps = dispatch => ({
    addCartItem: (product) => dispatch(actions.addCartItem(product)),
    getProduct: (productId) => dispatch(actions.getProduct(productId)),
    removeProduct: () => dispatch(actions.removeProduct()),
    getRecommendations: (productId) => dispatch(actions.getRecommendations(productId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductContainer);

