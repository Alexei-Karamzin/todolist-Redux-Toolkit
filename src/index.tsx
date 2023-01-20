import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {App} from "./App/App";
import {Provider} from "react-redux";
import {store} from "./App/store";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    , document.getElementById('root')
);

// add HashRouter !!

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



if (process.env.NODE_ENV !== 'production' && module.hot) {
    /*module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))*/
}