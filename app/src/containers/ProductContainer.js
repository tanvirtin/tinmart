// // Smart container component

// import React, { Component } from 'react';

// import { DefaultLayout } from '../components/DefaultLayout';

// import { BasicItemCard } from '../components/BasicItemCard';

// import { ActivitySpinner } from '../components/ActivitySpinner';

// import { connect } from 'react-redux';

// import { BackHandler, Button } from 'react-native';

// import { NavigationActions } from 'react-navigation';

// // Imports all action functions as an actions object
// import * as actions from '../actions/product'

// // json file that contains basic information about the app such as name and theme color
// const appInfo = require('../../appInfo.json');

// class ProductContainer extends Component {

//     constructor(props) {
//         super(props);
//         this.onMenuPress = this.onMenuPress.bind(this);
//         this.onBackPress = this.onBackPress.bind(this);
//     }

//     async componentDidMount() {
//         // attach the back event handler
//         BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
//     }

//     componentWillMount() {
//         // remove the back event handler
//         BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
//     }

//     onBackPress() {
//         // the function that gets attached to the back event handler and gets invoked everytime you press the back button which takes you back to the previous screen
//         this.props.navigation.dispatch(NavigationActions.back());
//         return true;
//     }

//     onMenuPress() {
//         // open the drawer when the menu button is pressed
//         this.props.navigation.navigate('DrawerOpen');
//     }

//     render() {
//         let loading = this.props.productUI.loading;

//         return (
//             <DefaultLayout
//                 onMenuPress = {this.onMenuPress}
//             >
//             {/* This is saying that if homeUI.loading is true then only render this element */}
//             {loading && <ActivitySpinner/>}
//             </DefaultLayout>
//         );
//     }

// }

// const mapStateToProps = (appState, navigationState) => ({
//     navigation: navigationState.navigation,
//     screenProps: navigationState.screenProps,
//     navigatorStack: appState.navigatorStack,
//     // will contain all products in the cartItem
//     cartItems: appState.cartItems,
//     productUI: appState.productUI
// })

// const mapDispatchToProps = dispatch => ({

// });

// export default connect(mapStateToProps, mapDispatchToProps)(ProductContainer);