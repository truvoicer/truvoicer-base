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
import {isEmpty, isObject, isSet} from "../../library/utils";
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
import {LISTINGS_BLOCK_SOURCE_API, LISTINGS_BLOCK_SOURCE_WORDPRESS} from "../constants/general_constants";

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
    switch (listingsDataState?.source) {
        case LISTINGS_BLOCK_SOURCE_WORDPRESS:
            postsListingsInitialLoad(listingsDataState)
            break;
        case LISTINGS_BLOCK_SOURCE_API:
        default:
            apiListingsInitialLoad(listingsDataState)
            break;
    }

}

function postsListingsInitialLoad(listingsDataState) {
    console.log({listingsDataState})
    if (!Array.isArray(listingsDataState?.item_list_id)) {
        return;
    }
    let listData = [];
    listingsDataState.item_list_id.forEach(itemList => {
        if (!Array.isArray(itemList?.item_list?.item_list)) {
            return;
        }
        const itemListData = itemList?.item_list?.item_list;
        itemListData.forEach(item => {
            switch (item.type) {
                case "single_item":
                    if (!item?.single_item_id?.ID) {
                        return;
                    }
                    if (!item?.single_item_id?.post_name) {
                        return;
                    }
                    if (!isObject(item?.single_item_id?.api_data_keys?.data_keys)) {
                        return;
                    }
                    listData.push(
                        buildDataKeyObject(
                            item?.single_item_id?.api_data_keys.data_keys,
                            item?.single_item_id?.ID,
                            item?.single_item_id?.post_name
                        )
                    );
                    break;
            }
        });
    })

    store.dispatch(setSearchOperation(NEW_SEARCH_REQUEST));
    const category = listingsDataState.listings_category;
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
    if (!isSet(listingsDataState.initial_request) || !isSet(listingsDataState.initial_request.request_options)) {
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
