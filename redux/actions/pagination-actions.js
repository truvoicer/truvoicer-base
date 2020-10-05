import {
    PAGE_CONTROL_CURRENT_PAGE,
    PAGE_CONTROL_HAS_MORE,
    PAGE_CONTROL_PAGE_SIZE,
    PAGE_CONTROL_PAGINATION_REQUEST,
    PAGE_CONTROL_TOTAL_ITEMS,
    PAGE_CONTROL_TOTAL_PAGES
} from "../constants/search-constants";
import {isSet} from "../../library/utils";
import store from "../store";
import {setPageControls} from "../reducers/search-reducer";
import {fetcherApiConfig} from "../../config/fetcher-api-config";

export function setPageControlsAction(extraData) {
    let pageControlsState = {...store.getState().search.pageControls}
    if (pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
        return false;
    }
    const pageControlsObject = Object.assign({}, pageControlsState, {
        hasMore: false,
        totalItems: getTotalItems(pageControlsState, extraData),
        totalPages: getTotalPages(pageControlsState, extraData),
    });
    // console.log(pageControlsObject)
    store.dispatch(setPageControls(pageControlsObject))
}

export function setPageControlItemAction(key, value) {
    let pageControlsState = {...store.getState().search.pageControls}
    const pageControlsObject = Object.assign({}, pageControlsState, {
        [key]: value
    });
    store.dispatch(setPageControls(pageControlsObject))
}

export function getSearchLimit() {
    const listingsDataState = {...store.getState().listings.listingsData}
    if (isSet(listingsDataState.search_limit) &&
        listingsDataState.search_limit !== "" &&
        listingsDataState.search_limit !== null &&
        !isNaN(listingsDataState.search_limit)) {
        return parseInt(listingsDataState.search_limit)
    }
    return fetcherApiConfig.defaultSearchLimit;

}

function getTotalItems(pageControlsState, requestPageControls) {
    let totalItems = pageControlsState[PAGE_CONTROL_TOTAL_ITEMS];
    let requestTotalItems = requestPageControls.total_items;
    if (isSet(requestTotalItems) && requestTotalItems !== "" && !isNaN(requestTotalItems)) {
        return totalItems + parseInt(requestTotalItems)
    }
    return totalItems;
}

function getTotalPages(pageControlsState, requestPageControls) {
    let totalPages = pageControlsState[PAGE_CONTROL_TOTAL_PAGES];
    let requestTotalPages;
    if (isSet(requestPageControls.page_number)) {
        requestTotalPages = requestPageControls.page_count;
    } else if (isSet(requestPageControls.page_offset)) {
        requestTotalPages = Math.floor(requestPageControls.total_items / fetcherApiConfig.defaultSearchLimit);
    }
    if (isSet(requestTotalPages) && requestTotalPages !== "" && requestTotalPages !== null) {
        return totalPages + parseInt(requestTotalPages)
    }
    return totalPages;
}

export function getCurrentPageFromOffset(pageOffset) {
    const pageControlsState = {...store.getState().search.pageControls}
    let totalItems = pageControlsState[PAGE_CONTROL_TOTAL_ITEMS];
    let totalPages = pageControlsState[PAGE_CONTROL_TOTAL_PAGES];
    let pageSize = pageControlsState[PAGE_CONTROL_PAGE_SIZE];
    let offsetPageCount = Math.floor(totalItems - pageOffset)

    if (pageOffset === 0) {
        return Math.floor(totalPages - Math.floor(totalItems / pageSize)) + 1;
    } else {
        return Math.floor(totalPages - Math.floor((offsetPageCount / pageSize)));
    }
}

export function getOffsetFromPageNUmber(pageNumber) {
    const pageControlsState = {...store.getState().search.pageControls}
    let pageSize = pageControlsState[PAGE_CONTROL_PAGE_SIZE];
    return parseInt(pageSize) * parseInt(pageNumber);
}

export function setHasMoreSearchPages() {
    const pageControlsState = {...store.getState().search.pageControls}
     if (pageControlsState[PAGE_CONTROL_CURRENT_PAGE] > 0) {
        if (parseInt(pageControlsState[PAGE_CONTROL_CURRENT_PAGE]) < parseInt(pageControlsState[PAGE_CONTROL_TOTAL_PAGES])) {
            setPageControlItemAction(PAGE_CONTROL_HAS_MORE, true);
            return true;
        }
    }
     setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
    return false;
}

export function addPaginationQueryParameters(queryData, providerName = null) {
    const pageControlsState = {...store.getState().search.pageControls};
    const extraData = store.getState().search.extraData[providerName];
    const currentPage = pageControlsState[PAGE_CONTROL_CURRENT_PAGE];

    if (!isSet(extraData)) {
        return queryData;
    }

    queryData["page_number"] = currentPage;
    queryData["page_offset"] = queryData["limit"] * currentPage;
    return queryData;
}

export function addProviderToSearch(provider) {
    const pageControlsState = {...store.getState().search.pageControls};
    const extraData = store.getState().search.extraData[provider];
    if (!isSet(extraData)) {
        return true;
    }
    else if (pageControlsState[PAGE_CONTROL_CURRENT_PAGE] === 1) {
        return true;
    }
    else if (isSet(extraData.total_items) && !isNaN(extraData.total_items)) {
        if (providerHasMoreItems(
            pageControlsState[PAGE_CONTROL_CURRENT_PAGE],
            pageControlsState[PAGE_CONTROL_PAGE_SIZE],
            parseInt(extraData.total_items)
        )) {
            return true;
        }
    }
    return false;
}

export function providerHasMoreItems(currentPage, pageSize, providerTotalItems) {
    return (currentPage * pageSize) < parseInt(providerTotalItems);
}