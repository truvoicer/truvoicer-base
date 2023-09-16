import React from "react";
import store from "../store";
import {
    setListingsQueryData,
    setListingsScrollTop,
} from "../reducers/listings-reducer"
import {
    runSearch,
} from "./search-actions";


export function addQueryDataObjectAction(queryData, search = false) {
    let listingsQueryData = {...store.getState().listings.listingsQueryData}
    let newQueryData = {};
    Object.keys(queryData).map(value => {
        newQueryData[value] = queryData[value];

    });
    const object = Object.assign({}, listingsQueryData, newQueryData);

    store.dispatch(setListingsQueryData(object))
    if (search) {
        runSearch();
    }
}

export function setListingsScrollTopAction(show) {
    store.dispatch(setListingsScrollTop(show))
}
