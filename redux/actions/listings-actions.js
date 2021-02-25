import React from "react";
import store from "../store";
import {
    setListingsQueryData,
    setListingsScrollTop,
    setListingsGrid
} from "../reducers/listings-reducer"
import {
    initialSearch,
    runSearch, setSearchCategoryAction, setSearchExtraDataAction, setSearchListDataAction, setSearchProviderAction,
    setSearchRequestServiceAction, setSearchRequestStatusAction
} from "./search-actions";
import {isEmpty, isSet} from "../../library/utils";
import {setSearchError, setSearchOperation} from "../reducers/search-reducer";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_COMPLETED} from "../constants/search-constants";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import PostsListingsBlock
    from "../../../views/Components/Blocks/Listings/ListingsBlock/Sources/Posts/PostsListingsBlock";
import FetcherApiListingsBlock
    from "../../../views/Components/Blocks/Listings/ListingsBlock/Sources/FetcherApi/FetcherApiListingsBlock";
import {buildDataKeyObject} from "../../library/helpers/items";
import {getUserItemsListAction} from "./user-stored-items-actions";
import {setPageControlsAction} from "./pagination-actions";
import {siteConfig} from "../../../config/site-config";

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
    switch (listingsDataState?.listing_block_source) {
        case "posts":
            postsListingsInitialLoad(listingsDataState)
            break;
        case "api":
        default:
            apiListingsInitialLoad(listingsDataState)
            break;
    }

}

function postsListingsInitialLoad(listingsDataState) {
    const listData = listingsDataState.posts_list.data.map(item => {
        switch (item.item_type) {
            case "post":
                return buildDataKeyObject(
                    item.item_post.data.api_data_keys_list,
                    item.item_post.post_type.ID
                )
        }
    })

    store.dispatch(setSearchOperation(NEW_SEARCH_REQUEST));
    const category = listingsDataState.listings_category.slug;
    getUserItemsListAction(listData, siteConfig.internalProviderName, category)
    setSearchListDataAction(listData);
    setSearchCategoryAction(category)
    setSearchProviderAction(siteConfig.internalProviderName)
    setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
    // setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
    // setSearchRequestServiceAction(data.request_service)
    // setPageControlsAction(data.extra_data)
}

function apiListingsInitialLoad(listingsDataState) {
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