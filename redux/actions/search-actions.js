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
import {isSet} from "../../library/utils";
import {produce} from "immer";
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
    addProviderToSearch,
    setHasMoreSearchPages,
    setPageControlItemAction,
    setPageControlsAction
} from "./pagination-actions";
import {getUserItemsListAction} from "./user-stored-items-actions";

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
            // store.dispatch(setSearchOperation(APPEND_SEARCH_REQUEST));
            draftState.splice(0, draftState.length + 1);

        } else if (searchOperation === APPEND_SEARCH_REQUEST) {
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
    if (!isSet(listingsDataState.listings_category)) {
        console.log("No category found...")
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

export function filterSearchProviders(allProviders) {
    let filteredProviders = [];
    allProviders.map(provider => {
        if (addProviderToSearch(provider)) {
            filteredProviders.push(provider)
        }
    })
    return filteredProviders;
}

export function getSearchProviders() {
    const queryDataState = {...store.getState().listings.listingsQueryData};
    const listingsDataState = {...store.getState().listings.listingsData};
    let providers = [];
    if (!isSet(queryDataState.providers) || queryDataState.providers.length === 0) {
        providers = listingsDataState.providers.map(provider => {
            return provider.provider_name;
        });
        providers.map((provider) => {
            addArrayItem("providers", provider)
        });
    } else {
        providers = queryDataState.providers.map(provider => {
            return provider;
        });
    }
    return providers
}

export function buildQueryData(allProviders, provider) {
    let queryData = {...store.getState().listings.listingsQueryData};
    queryData["limit"] = calculateLimit(allProviders.length);
    queryData = addPaginationQueryParameters(queryData, provider);
    queryData["provider"] = provider;
    console.log({queryData})
    return queryData;
}

export const runSearch = (operation = false) => {
    console.log("runSearch")
    setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
    const pageControlsState = store.getState().search.pageControls;
    if (!validateSearchParams()) {
        setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
        return false;
    }

    if (!pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
        setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, 1);
    }
    const providers = getSearchProviders();
    const filterProviders = filterSearchProviders(providers);
    filterProviders.map((provider, index) => {
        fetchData(
            "operation",
            [getEndpointOperation()],
            buildQueryData(filterProviders, provider),
            searchResponseHandler,
            (filterProviders.length === index + 1)
        )
    })
}

function calculateLimit(providerCount) {
    const pageControlsState = {...store.getState().search.pageControls}
    let pageSize = pageControlsState[PAGE_CONTROL_PAGE_SIZE];
    return Math.floor(pageSize / providerCount);
}

export function initialSearch() {
    store.dispatch(setSearchOperation(NEW_SEARCH_REQUEST));
    const listingsDataState = store.getState().listings.listingsData;

    if (!Array.isArray(listingsDataState?.initial_load_search_params)) {
        setSearchError("Initial search data is not set on initial search...")
        return false;
    }
    if (!listingsDataState.initial_load_search_params.length) {
        setSearchError("Initial search data is empty on initial search...")
        return false;
    }
    let initialSearch = listingsDataState.initial_load_search_params;
    if (!isSet(initialSearch.name || !isSet(initialSearch.value))) {
        setSearchError("Initial search parameters are not set...")
        return false;
    }
    let queryData = {};
    listingsDataState.initial_load_search_params.forEach((item) => {
        queryData[item.name] = item.value;
    });
    queryData[fetcherApiConfig.pageNumberKey] = 1;
    queryData[fetcherApiConfig.pageOffsetKey] = 0;
    setSearchRequestServiceAction(fetcherApiConfig.searchOperation)
    addQueryDataObjectAction(queryData, true);
}
