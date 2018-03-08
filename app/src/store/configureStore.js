import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

export default configureStore = () => {
    const enhancer = compose(applyMiddleware(loggerMiddleware, thunk));
    const store = createStore(rootReducer, enhancer);

    // if hot reloading is enabled
    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require('../reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
