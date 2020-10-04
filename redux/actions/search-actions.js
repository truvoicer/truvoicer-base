import React from "react";
import store from "../store";
import {fetchData} from "../../library/api/fetcher/middleware";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {
    setCategory,
    setExtraData,
    setProvider,
    setRequestService,
    setSearchError,
    setSearchList,
    setSearchOperation,
    setSearchStatus,
} from "../reducers/search-reducer"
import {isEmpty, isSet} from "../../library/utils";
import produce from "immer";
import {addArrayItem, addListingsQueryDataString} from "../middleware/listings-middleware";
import {addQueryDataObjectAction} from "./listings-actions";
import {
    APPEND_SEARCH_REQUEST,
    NEW_SEARCH_REQUEST,
    PAGE_CONTROL_CURRENT_PAGE,
    PAGE_CONTROL_PAGE_SIZE,
    PAGE_CONTROL_PAGINATION_REQUEST,
    SEARCH_REQUEST_COMPLETED,
    SEARCH_REQUEST_ERROR,
    SEARCH_REQUEST_STARTED
} from "../constants/search-constants";
import {
    addPaginationQueryParameters,
    setHasMoreSearchPages,
    setPageControlItemAction,
    setPageControlsAction
} from "./pagination-actions";
import {Routes} from "../../config/routes";
import Router from "next/router";
import {getUserItemsListAction} from "./user-stored-items-actions";
import {siteConfig} from "../../../config/site-config";

const axios = require('axios');
const sprintf = require("sprintf").sprintf;

export function setSearchExtraDataAction(extraData, provider, listData) {
    const extraDataState = {...store.getState().search.extraData};

    const nextState = produce(extraDataState, (draftState) => {
        if (!isSet(draftState[provider])) {
            draftState[provider] = {};
            extraData.item_count = listData.length;
        } else {
            extraData.item_count = parseInt(extraDataState[provider].item_count) + parseInt(listData.length)
        }
        draftState[provider] = extraData;
    })
    store.dispatch(setExtraData(nextState))
}

export function setSearchListDataAction(listData) {
    const searchState = {...store.getState().search};
    if (listData.length === 0) {
        return
    }
    const searchOperation = searchState.searchOperation;

    const nextState = produce(searchState.searchList, (draftState) => {
        if ((searchOperation === NEW_SEARCH_REQUEST)) {
            // console.log(searchOperation)
            store.dispatch(setSearchOperation(APPEND_SEARCH_REQUEST));
            draftState.splice(0, draftState.length + 1);

        } else if (searchOperation === APPEND_SEARCH_REQUEST) {
            // console.log("append")
        }
        listData.map((item) => {
            draftState.push(item)
        })
    })
    store.dispatch(setSearchList(nextState))
}

export function setSearchProviderAction(provider) {
    store.dispatch(setProvider(provider))
}

export function setSearchCategoryAction(category) {
    store.dispatch(setCategory(category))
}

export function setSearchRequestServiceAction(requestService) {
    store.dispatch(setRequestService(requestService))
}

export function setSearchRequestStatusAction(status) {
    store.dispatch(setSearchStatus(status))
}
export function setSearchRequestOperationAction(operation) {
        store.dispatch(setSearchOperation(operation))
}

export function setSearchRequestErrorAction(error) {
    store.dispatch(setSearchError(error))
}

export function searchResponseHandler(status, data, completed = false) {
    console.log(status, data)
    if (status === 200 && data.status === "success") {
        getUserItemsListAction(data.request_data, data.provider, data.category)
        setSearchListDataAction(data.request_data);
        setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
        setSearchRequestServiceAction(data.request_service)
        setSearchProviderAction(data.provider)
        setSearchCategoryAction(data.category)
        setPageControlsAction(data.extra_data)

    } else {
        setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
        setSearchRequestErrorAction(data.message)
    }
    if (completed) {
        setHasMoreSearchPages()
        setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
    }
}

function validateSearchParams() {
    const listingsDataState = store.getState().listings.listingsData;
    const queryDataState = store.getState().listings.listingsQueryData;
    if (!isSet(listingsDataState.listing_block_category)) {
        setSearchRequestErrorAction("No category found...")
        return false;
    }
    if (!isSet(queryDataState[fetcherApiConfig.searchLimitKey])) {
        addListingsQueryDataString(fetcherApiConfig.searchLimitKey, fetcherApiConfig.defaultSearchLimit);
    }
    return true;
}

function getEndpointOperation() {
    const searchState = store.getState().search;
    if (isSet(searchState.requestService) && searchState.requestService !== "") {
        return searchState.requestService;
    }
    return fetcherApiConfig.defaultOperation
}

export const runSearch = (operation = false) => {
    setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
    const listingsDataState = store.getState().listings.listingsData;
    const queryDataState = store.getState().listings.listingsQueryData;
    const pageControlsState = store.getState().search.pageControls;
    if (!validateSearchParams()) {
        setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
        return false;
    }

    if (!pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
        setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, 1);
    }

    let queryData = {...queryDataState};
    if (!isSet(queryDataState.providers) || queryDataState.providers.length === 0) {
        let providers = [];
        queryData["limit"] = calculateLimit(listingsDataState.providers.length);
        listingsDataState.providers.map((provider, index) => {
            providers.push(provider.provider_name)
            queryData = addPaginationQueryParameters(queryData, provider.provider_name);
            if (queryData) {
                queryData["provider"] = provider.provider_name;
                fetchData(
                    "operation",
                    [getEndpointOperation()],
                    queryData,
                    searchResponseHandler,
                    (listingsDataState.providers.length === index + 1)
                )
            }
        });
        providers.map((provider) => {
            addArrayItem("providers", provider)
        })
    } else {
        queryData["limit"] = calculateLimit(queryDataState.providers.length);
        queryDataState.providers.map((provider, index) => {
            queryData = addPaginationQueryParameters(queryData, provider);
            if (queryData) {
                queryData["provider"] = provider;
                fetchData(
                    "operation",
                    [getEndpointOperation()],
                    queryData, searchResponseHandler,
                    (queryDataState.providers.length === index + 1)
                )
            }
        });
    }

}

function calculateLimit(providerCount) {
    const pageControlsState = {...store.getState().search.pageControls}
    let pageSize = pageControlsState[PAGE_CONTROL_PAGE_SIZE];
    // console.log(pageSize, providerCount, Math.floor(pageSize / providerCount))
    return Math.floor(pageSize / providerCount);
}

export function initialSearch() {
    store.dispatch(setSearchOperation(NEW_SEARCH_REQUEST));
    const listingsDataState = store.getState().listings.listingsData;

    if (!isSet(listingsDataState.initial_search)) {
        setSearchError("Initial search data is not set on initial search...")
        return false;
    }
    let initialSearch = listingsDataState.initial_search;
    if (!isSet(initialSearch.parameter_name || !isSet(initialSearch.parameter_value))) {
        setSearchError("Initial search parameters are not set...")
        return false;
    }
    let queryData = {};
    queryData[initialSearch.parameter_name] = initialSearch.parameter_value;
    queryData[fetcherApiConfig.pageNumberKey] = 1;
    queryData[fetcherApiConfig.pageOffsetKey] = 0;
    setSearchRequestServiceAction(fetcherApiConfig.searchOperation)
    addQueryDataObjectAction(queryData, true);
}

export function getItemViewUrl(item, category) {
    const data = {
        category: category,
        provider: item.provider,
        item_id: item.item_id
    }
    return sprintf(Routes.itemView, data);
}

