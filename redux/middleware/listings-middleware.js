import React from "react";
import store from "../store";
import {fetchData} from "../../library/api/fetcher/middleware";
import {
    setListingsGrid,
    setListingsData,
    setListingsQueryData,
    setListingsDataProviders,
    setListingsError
} from "../reducers/listings-reducer"
import {isSet} from "../../library/utils";
import {
    initialSearch,
    runSearch,
    setSearchRequestOperationAction
} from "../actions/search-actions";
import {NEW_SEARCH_REQUEST, PAGE_CONTROL_PAGE_SIZE} from "../constants/search-constants";
import {getSearchLimit, setPageControlItemAction} from "../actions/pagination-actions";
import {getListingsInitialLoad} from "../actions/listings-actions";

export function getListingsProviders(category) {
    fetchData("list", [category, "providers"], {}, getProvidersCallback);
}

export function getProvidersCallback(status, data) {
    if (status === 200) {
        // console.log(data.data)
        store.dispatch(setListingsDataProviders(data.data))
        setPageControlItemAction(PAGE_CONTROL_PAGE_SIZE, getSearchLimit())
        getListingsInitialLoad();
    } else {
        // console.error(data.message)
        store.dispatch(setListingsError(data.message))
    }
}

export function addArrayItem(key, value, search = false) {
    return function (dispatch) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}
        const object = Object.assign({}, listingsQueryData, {
            [key]: (isSet(listingsQueryData[key])) ? listingsQueryData[key].concat(value) : [value]
        });
        dispatch(setListingsQueryData(object))
        if (search) {
            runSearch();
        }
    }
}

export function removeArrayItem(key, value, search = false) {
    return function (dispatch) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}
        let index = listingsQueryData[key].indexOf(value);
        const newArray = [...listingsQueryData[key]]
        newArray.splice(index, 1)
        if (index === -1) return;

        const object = Object.assign({}, listingsQueryData, {
            [key]: newArray
        });
        dispatch(setListingsQueryData(object))
        if (search) {
            runSearch();
        }
    }
}

export function addListingsQueryDataString(key, value, search = false) {
    return function (dispatch) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}

        const object = Object.assign({}, listingsQueryData, {
            [key]: value
        });
        dispatch(setListingsQueryData(object))
        if (search) {
            runSearch();
        }
    }
}

export function addQueryDataObjectMiddleware(queryData, search = false) {
    return function (dispatch) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}
        let newQueryData = {};
        Object.keys(queryData).map(value => {
            newQueryData[value] = queryData[value];

        });
        const object = Object.assign({}, listingsQueryData, newQueryData);

        dispatch(setListingsQueryData(object))
        if (search) {
            runSearch();
        }
    }
}

export function setListingsGridMiddleware(listingsGrid) {
    return function (dispatch) {
        dispatch(setListingsGrid(listingsGrid))
    }
}