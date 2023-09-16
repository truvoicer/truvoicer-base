import React from "react";
import store from "../store";
import {fetchData} from "../../library/api/fetcher/middleware";
import {
    setListingsGrid,
    setListingsQueryData,
    setListingsDataProviders,
    setListingsError
} from "../reducers/listings-reducer"
import {isSet} from "../../library/utils";
import {
    runSearch
} from "../actions/search-actions";


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
