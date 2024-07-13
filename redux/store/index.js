import {
    configureStore,
} from "@reduxjs/toolkit";

import thunk from "redux-thunk";
import {pageReducer} from "../reducers/page-reducer";
import {sessionReducer} from "../reducers/session-reducer";
import {itemReducer} from "../reducers/item-reducer";
import {getStoreReducers} from "../../library/helpers/redux";
import {APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";
import {appReducer} from "@/truvoicer-base/redux/reducers/app-reducer";

const middleware = [
    thunk
];
const defaultReducers = {
    [APP_STATE]: appReducer,
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
