import {
    configureStore,
} from "@reduxjs/toolkit";

import thunk from "redux-thunk";
import {pageReducer} from "../reducers/page-reducer";
import {sessionReducer} from "../reducers/session-reducer";
import {itemReducer} from "../reducers/item-reducer";
import {getStoreReducers} from "../../library/helpers/redux";

const middleware = [
    thunk
];
const defaultReducers = {
    page: pageReducer,
    item: itemReducer,
    session: sessionReducer
}
const reducer = getStoreReducers(defaultReducers);
const store = configureStore({
    reducer,
    middleware,
});

export default store;
