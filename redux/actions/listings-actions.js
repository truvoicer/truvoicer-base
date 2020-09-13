import React from "react";
import store from "../store";
import {fetchData} from "../../library/api/fetcher/middleware";
import {
    setListingsData,
    setListingsQueryData,
    setListingsDataProviders,
    setListingsError, setListingsGrid
} from "../reducers/listings-reducer"
import {isSet} from "../../library/utils";
import {initialSearch, runSearch, setSearchRequestOperationAction} from "./search-actions";
import {NEW_SEARCH_REQUEST} from "../constants/search-constants";
import {LISTINGS_GRID_COMPACT, LISTINGS_GRID_DETAILED} from "../constants/listings-constants";

export function addQueryDataString(key, value, search = false) {
    let listingsQueryData = {...store.getState().listings.listingsQueryData}

    const object = Object.assign({}, listingsQueryData, {
        [key]: value
    });
    store.dispatch(setListingsQueryData(object))
    if (search) {
        runSearch();
    }
}

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

export function setListingsGridAction(listingsGrid) {
    store.dispatch(setListingsGrid(listingsGrid))
}