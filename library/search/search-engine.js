import {
    APPEND_SEARCH_REQUEST,
    NEW_SEARCH_REQUEST,
    PAGE_CONTROL_CURRENT_PAGE, PAGE_CONTROL_HAS_MORE, PAGE_CONTROL_PAGE_SIZE,
    PAGE_CONTROL_PAGINATION_REQUEST, PAGE_CONTROL_TOTAL_ITEMS, PAGE_CONTROL_TOTAL_PAGES,
    SEARCH_REQUEST_COMPLETED,
    SEARCH_REQUEST_ERROR,
    SEARCH_REQUEST_IDLE,
    SEARCH_REQUEST_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import store from "@/truvoicer-base/redux/store";
import {produce} from "immer";
import {isSet} from "@/truvoicer-base/library/utils";
import {
    setCategory,
    setExtraData, setPageControls,
    setProvider, setRequestService, setSearchError,
    setSearchList,
    setSearchOperation, setSearchStatus
} from "@/truvoicer-base/redux/reducers/search-reducer";
import {
    getUserItemsListAction,
    saveItemAction,
    saveItemRatingAction, updateSavedItemAction
} from "@/truvoicer-base/redux/actions/user-stored-items-actions";
import {
    addPaginationQueryParameters,
    addProviderToSearch, getCurrentPageFromOffset,
    setHasMoreSearchPages, setPageControlItemAction,
    setPageControlsAction
} from "@/truvoicer-base/redux/actions/pagination-actions";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {addArrayItem, addListingsQueryDataString} from "@/truvoicer-base/redux/middleware/listings-middleware";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {addQueryDataObjectAction, addQueryDataString} from "@/truvoicer-base/redux/actions/listings-actions";
import {runSearch, setSearchRequestStatusAction} from "@/truvoicer-base/redux/actions/search-actions";

export class SearchEngine {
    constructor() {
        this.searchData = {
            searchStatus: SEARCH_REQUEST_IDLE,
            searchOperation: NEW_SEARCH_REQUEST,
            extraData: {},
            searchList: [],
            savedItemsList: [],
            itemRatingsList: [],
            pageControls: {
                paginationRequest: false,
                hasMore: false,
                totalItems: 0,
                totalPages: 0,
                currentPage: 0,
                pageSize: 0
            },
            requestService: "",
            provider: "",
            category: "",
            error: {},
            updateData: () => {}
        }
    }

    setSearchExtraDataAction(extraData, provider, listData) {
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

    setSearchListDataAction(listData) {
        const searchState = {...store.getState().search};
        if (listData.length === 0) {
            return
        }
        const searchOperation = searchState.searchOperation;

        const nextState = produce(searchState.searchList, (draftState) => {
            if ((searchOperation === NEW_SEARCH_REQUEST)) {
                store.dispatch(setSearchOperation(APPEND_SEARCH_REQUEST));
                draftState.splice(0, draftState.length + 1);

            } else if (searchOperation === APPEND_SEARCH_REQUEST) {
            }
            listData.map((item) => {
                draftState.push(item)
            })
        })
        store.dispatch(setSearchList(nextState))
    }

    setSearchProviderAction(provider) {
        store.dispatch(setProvider(provider))
    }

    setSearchCategoryAction(category) {
        store.dispatch(setCategory(category))
    }

    setSearchRequestServiceAction(requestService) {
        store.dispatch(setRequestService(requestService))
    }

    setSearchRequestStatusAction(status) {
        store.dispatch(setSearchStatus(status))
    }
    setSearchRequestOperationAction(operation) {
        store.dispatch(setSearchOperation(operation))
    }

    setSearchRequestErrorAction(error) {
        store.dispatch(setSearchError(error))
    }

    searchResponseHandler(status, data, completed = false) {
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

    validateSearchParams() {
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

    getEndpointOperation() {
        const searchState = store.getState().search;
        if (isSet(searchState.requestService) && searchState.requestService !== "") {
            return searchState.requestService;
        }
        return fetcherApiConfig.defaultOperation
    }

    filterSearchProviders(allProviders) {
        let filteredProviders = [];
        allProviders.map(provider => {
            if (addProviderToSearch(provider)) {
                filteredProviders.push(provider)
            }
        })
        return filteredProviders;
    }

    getSearchProviders() {
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

    buildQueryData(allProviders, provider) {
        let queryData = {...store.getState().listings.listingsQueryData};
        queryData["limit"] = calculateLimit(allProviders.length);
        queryData = addPaginationQueryParameters(queryData, provider);
        queryData["provider"] = provider;
        console.log({queryData})
        return queryData;
    }

    runSearch(operation = false) {
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

    calculateLimit(providerCount) {
        const pageControlsState = {...store.getState().search.pageControls}
        let pageSize = pageControlsState[PAGE_CONTROL_PAGE_SIZE];
        return Math.floor(pageSize / providerCount);
    }

    initialSearch() {
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


    setSearchProviderMiddleware(provider) {
        return function (dispatch) {
            dispatch(setProvider(provider))
        }
    }

    setSearchCategoryMiddleware(category) {
        return function (dispatch) {
            dispatch(setCategory(category))
        }
    }

    setSearchRequestServiceMiddleware(requestService) {
        return function (dispatch) {
            dispatch(setRequestService(requestService))
        }
    }

    setSearchRequestStatusMiddleware(status) {
        return function (dispatch) {
            dispatch(setSearchStatus(status))
        }
    }
    setSearchRequestOperationMiddleware(operation) {
        return function (dispatch) {
            dispatch(setSearchOperation(operation))
        }
    }

    setPageControlItemMiddleware(key, value) {
        return function (dispatch) {
            let pageControlsState = {...store.getState().search.pageControls}
            const pageControlsObject = Object.assign({}, pageControlsState, {
                [key]: value
            });
            dispatch(setPageControls(pageControlsObject))
        }
    }

    setSearchRequestErrorMiddleware(error) {
        return function (dispatch) {
            dispatch(setSearchError(error))
        }
    }


    loadNextPageNumberMiddleware(pageNumber) {
        return function (dispatch) {
            setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
            setPageControlItemAction(PAGE_CONTROL_PAGINATION_REQUEST, true)
            setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, parseInt(pageNumber))
            // addQueryDataString("page_number", pageNumber, true)
            runSearch()
        }
    }

    loadNextOffsetMiddleware(pageOffset) {
        return function (dispatch) {
            setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
            setPageControlItemAction(PAGE_CONTROL_PAGINATION_REQUEST, true)
            setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, getCurrentPageFromOffset(parseInt(pageOffset)))
            addQueryDataString("page_offset", pageOffset, true)
        }
    }

    saveItemMiddleware(provider, category, itemId, user_id) {
        return function(dispatch) {
            saveItemAction(provider, category, itemId, user_id)
        }
    }
    saveItemRatingMiddleware(provider, category, itemId, user_id, rating) {
        return function(dispatch) {
            saveItemRatingAction(provider, category, itemId, user_id, rating)
        }
    }


    updateSavedItemMiddleware(data) {
        return function (dispatch) {
            updateSavedItemAction(data);
        }
    }


    setPageControlsAction(extraData) {
        let pageControlsState = {...store.getState().search.pageControls}
        if (pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            return false;
        }
        const pageControlsObject = Object.assign({}, pageControlsState, {
            hasMore: false,
            totalItems: getTotalItems(pageControlsState, extraData),
            totalPages: getTotalPages(pageControlsState, extraData),
        });
        store.dispatch(setPageControls(pageControlsObject))
    }

    setPageControlItemAction(key, value) {
        let pageControlsState = {...store.getState().search.pageControls}
        const pageControlsObject = Object.assign({}, pageControlsState, {
            [key]: value
        });
        store.dispatch(setPageControls(pageControlsObject))
    }

    getSearchLimit() {
        const listingsDataState = {...store.getState().listings.listingsData}
        if (isSet(listingsDataState.search_limit) &&
            listingsDataState.search_limit !== "" &&
            listingsDataState.search_limit !== null &&
            !isNaN(listingsDataState.search_limit)) {
            return parseInt(listingsDataState.search_limit)
        }
        return fetcherApiConfig.defaultSearchLimit;

    }

    getTotalItems(pageControlsState, requestPageControls) {
        let totalItems = pageControlsState[PAGE_CONTROL_TOTAL_ITEMS];
        let requestTotalItems = requestPageControls.total_items;
        if (isSet(requestTotalItems) && requestTotalItems !== "" && !isNaN(requestTotalItems)) {
            return totalItems + parseInt(requestTotalItems)
        }
        return totalItems;
    }

    getTotalPages(pageControlsState, requestPageControls) {
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

    getCurrentPageFromOffset(pageOffset) {
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

    getOffsetFromPageNUmber(pageNumber) {
        const pageControlsState = {...store.getState().search.pageControls}
        let pageSize = pageControlsState[PAGE_CONTROL_PAGE_SIZE];
        return parseInt(pageSize) * parseInt(pageNumber);
    }

    setHasMoreSearchPages() {
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

    addPaginationQueryParameters(queryData, providerName = null) {
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

    addProviderToSearch(provider) {
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

    providerHasMoreItems(currentPage, pageSize, providerTotalItems) {
        return (currentPage * pageSize) < parseInt(providerTotalItems);
    }

}
