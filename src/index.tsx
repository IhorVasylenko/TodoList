import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {App} from "./app/App";
import * as serviceWorker from "./serviceWorker";
import {store} from "./app/store";
import {Provider} from "react-redux";
import {BrowserRouter, HashRouter} from "react-router-dom";

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>, document.getElementById("root"));

serviceWorker.unregister();
