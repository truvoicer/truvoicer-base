import {
    configureStore,
    getDefaultMiddleware,
} from "@reduxjs/toolkit";

import thunk from "redux-thunk";
import {pageReducer} from "../reducers/page-reducer";
import {listingsReducer} from "../reducers/listings-reducer";
import {searchReducer} from "../reducers/search-reducer";
import {sessionReducer} from "../reducers/session-reducer";
import {itemReducer} from "../reducers/item-reducer";
import {getStoreReducers} from "../../library/helpers/redux";

const middleware = [
    ...getDefaultMiddleware(),
    thunk
];
const defaultReducers = {
    page: pageReducer,
    listings: listingsReducer,
    search: searchReducer,
    item: itemReducer,
    session: sessionReducer
}
const reducer = getStoreReducers(defaultReducers);
const store = configureStore({
    reducer,
    middleware,
});

export default store;
