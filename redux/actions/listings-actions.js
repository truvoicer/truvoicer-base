import React from "react";
import store from "../store";
import {
    setListingsData,
    setListingsQueryData,
    setListingsDataProviders,
    setListingsScrollTop,
    setListingsError, setListingsGrid
} from "../reducers/listings-reducer"
import {
    initialSearch,
    runSearch,
    setSearchRequestOperationAction,
    setSearchRequestServiceAction
} from "./search-actions";
import {isEmpty, isSet} from "../../library/utils";
import {setSearchError, setSearchOperation} from "../reducers/search-reducer";
import {NEW_SEARCH_REQUEST} from "../constants/search-constants";
import {fetcherApiConfig} from "../../config/fetcher-api-config";

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

export function setListingsScrollTopAction(show) {
    store.dispatch(setListingsScrollTop(show))
}

export function getListingsInitialLoad() {
    const listingsDataState = store.getState().listings.listingsData;
    if (isEmpty(listingsDataState)) {
        setSearchError("Listings data empty on initial search...")
        return false;
    }
    if (!isSet(listingsDataState.initial_load)) {
        setSearchError("Initial load data is not set...")
        return false;
    }
    switch (listingsDataState.initial_load) {
        case "search":
            initialSearch();
            break;
        case "request":
            initialRequest();
            break;
    }
}


export function initialRequest() {
    store.dispatch(setSearchOperation(NEW_SEARCH_REQUEST));
    const listingsDataState = store.getState().listings.listingsData;
    if (!isSet(listingsDataState.initial_request) ||!isSet(listingsDataState.initial_request.request_options)) {
        setSearchError("Initial request options not set......")
        return false;
    }
    let requestOptions = listingsDataState.initial_request.request_options;
    if (!isSet(requestOptions.request_name) || requestOptions.request_name === null || requestOptions.request_name === "") {
        setSearchError("Initial request name not set...")
        return false;
    }
    let queryData = {};
    queryData[fetcherApiConfig.searchLimitKey] = requestOptions.request_limit;
    queryData[fetcherApiConfig.pageNumberKey] = 1;
    queryData[fetcherApiConfig.pageOffsetKey] = 0;
    setSearchRequestServiceAction(requestOptions.request_name)
    addQueryDataObjectAction(queryData, false);
    runSearch()
}