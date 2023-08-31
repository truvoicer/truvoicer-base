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
    setExtraData, setItemRatingsList, setPageControls,
    setProvider, setRequestService, setSavedItemsList, setSearchError,
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
import {ItemEngine} from "@/truvoicer-base/library/listings/item-engine";
import {SESSION_AUTHENTICATED} from "@/truvoicer-base/redux/constants/session-constants";
import {setModalContentAction} from "@/truvoicer-base/redux/actions/page-actions";
import {componentsConfig} from "@/config/components-config";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {ListingsEngineBase} from "@/truvoicer-base/library/listings/listings-engine-base";

export class SearchEngine extends ListingsEngineBase {
    constructor(listingsContext, searchContext, itemsContext) {
        super(searchContext, itemsContext);
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
        this.itemEngine = new ItemEngine();
    }

    setSearchContext(context) {
        this.searchContext = context;
    }
    updateContext({key, value}) {
        this.searchContext.updateData({key, value})
    }

    updatePageControls({key, value}) {
        let pageControls = {...this.searchContext.pageControls}
        pageControls[key] = value;
        this.updateContext({key: "pageControls", value: pageControls})
    }

    addError(error) {
        this.updateContext({key: "error", value: error})
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
        this.updateContext({key: "extraData", value: nextState})
    }

    setSearchListDataAction(listData) {
        const searchState = {...store.getState().search};
        if (listData.length === 0) {
            return
        }
        const searchOperation = searchState.searchOperation;

        const nextState = produce(searchState.searchList, (draftState) => {
            if ((searchOperation === NEW_SEARCH_REQUEST)) {
                this.updateContext({key: "searchOperation", value: APPEND_SEARCH_REQUEST})
                draftState.splice(0, draftState.length + 1);

            } else if (searchOperation === APPEND_SEARCH_REQUEST) {
            }
            listData.map((item) => {
                draftState.push(item)
            })
        })
        this.updateContext({key: "searchList", value: nextState})
    }

    setSearchProviderAction(provider) {
        this.updateContext({key: "provider", value: provider})
    }

    setSearchCategoryAction(category) {
        this.updateContext({key: "category", value: category})
    }

    setSearchRequestServiceAction(requestService) {
        this.updateContext({key: "requestService", value: requestService})
    }

    setSearchRequestStatusAction(status) {
        this.updateContext({key: "searchStatus", value: status})
    }
    setSearchRequestOperationAction(operation) {
        this.updateContext({key: "searchOperation", value: operation})
    }

    setSearchRequestErrorAction(error) {
        this.addError(error)
    }

    searchResponseHandler(status, data, completed = false) {
        if (status === 200 && data.status === "success") {
            this.itemEngine.getUserItemsListAction(data.request_data, data.provider, data.category)
            this.setSearchListDataAction(data.request_data);
            this.setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
            this.setSearchRequestServiceAction(data.request_service)
            this.setSearchProviderAction(data.provider)
            this.setSearchCategoryAction(data.category)
            this.setPageControlsAction(data.extra_data)

        } else {
            this.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            this.setSearchRequestErrorAction(data.message)
        }
        if (completed) {
            this.setHasMoreSearchPages()
            this.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
        }
    }

    validateSearchParams() {
        const listingsDataState = store.getState().listings.listingsData;
        const queryDataState = store.getState().listings.listingsQueryData;
        if (!isSet(listingsDataState.listings_category)) {
            console.log("No category found...")
            this.setSearchRequestErrorAction("No category found...")
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
            if (this.addProviderToSearch(provider)) {
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
        queryData["limit"] = this.calculateLimit(allProviders.length);
        queryData = this.addPaginationQueryParameters(queryData, provider);
        queryData["provider"] = provider;
        console.log({queryData})
        return queryData;
    }

    runSearch(operation = false) {
        console.log("runSearch")
        this.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
        const pageControlsState = store.getState().search.pageControls;
        if (!this.validateSearchParams()) {
            this.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            return false;
        }

        if (!pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            this.setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, 1);
        }
        const providers = this.getSearchProviders();
        const filterProviders = this.filterSearchProviders(providers);
        filterProviders.map((provider, index) => {
            fetchData(
                "operation",
                [this.getEndpointOperation()],
                this.buildQueryData(filterProviders, provider),
                this.searchResponseHandler,
                (filterProviders.length === index + 1)
            )
        })
    }

    calculateLimit(providerCount) {
        const pageControlsState = {...store.getState().search.pageControls}
        let pageSize = pageControlsState[PAGE_CONTROL_PAGE_SIZE];
        return Math.floor(pageSize / providerCount);
    }

    getInitialSearchQueryData(listingsDataState) {
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
        return queryData;
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
            this.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
            this.setPageControlItemAction(PAGE_CONTROL_PAGINATION_REQUEST, true)
            this.setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, parseInt(pageNumber))
            // addQueryDataString("page_number", pageNumber, true)
            this.runSearch()
        }
    }

    loadNextOffsetMiddleware(pageOffset) {
        return function (dispatch) {
            this.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
            this.setPageControlItemAction(PAGE_CONTROL_PAGINATION_REQUEST, true)
            this.setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, this.getCurrentPageFromOffset(parseInt(pageOffset)))
            this.addQueryDataString("page_offset", pageOffset, true)
        }
    }

    saveItemMiddleware(provider, category, itemId, user_id) {
        return function(dispatch) {
            this.saveItemAction(provider, category, itemId, user_id)
        }
    }
    saveItemRatingMiddleware(provider, category, itemId, user_id, rating) {
        return function(dispatch) {
            this.saveItemRatingAction(provider, category, itemId, user_id, rating)
        }
    }


    updateSavedItemMiddleware(data) {
        return function (dispatch) {
            this.updateSavedItemAction(data);
        }
    }


    setPageControlsAction(extraData) {
        let pageControlsState = {...store.getState().search.pageControls}
        if (pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            return false;
        }
        const pageControlsObject = Object.assign({}, pageControlsState, {
            hasMore: false,
            totalItems: this.getTotalItems(pageControlsState, extraData),
            totalPages: this.getTotalPages(pageControlsState, extraData),
        });
        this.updateContext({key: "pageControls", value: pageControlsObject})
    }

    setPageControlItemAction(key, value) {
        let pageControlsState = {...store.getState().search.pageControls}
        const pageControlsObject = Object.assign({}, pageControlsState, {
            [key]: value
        });
        this.updateContext({key: "pageControls", value: pageControlsObject})
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
                this.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, true);
                return true;
            }
        }
        this.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
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
            if (this.providerHasMoreItems(
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

    setSavedItemsListAction(data) {
        const searchState = {...store.getState().search};
        const searchOperation = searchState.searchOperation;
        const nextState = produce(searchState.savedItemsList, (draftState) => {
            if ((searchOperation === NEW_SEARCH_REQUEST)) {
                draftState.splice(0, draftState.length + 1);
            }
            data.map((item) => {
                if (!this.isSavedItemAction(item.item_id, item.provider_name, item.category, item.user_id)) {
                    draftState.push(item)
                }
            })
        })
        this.updateContext({key: "savedItemsList", value: nextState})
    }

    setItemRatingsListAction(data) {
        const searchState = {...store.getState().search};
        const searchOperation = searchState.searchOperation;
        const nextState = produce(searchState.itemRatingsList, (draftState) => {
            if ((searchOperation === NEW_SEARCH_REQUEST)) {
                draftState.splice(0, draftState.length + 1);
            }
            data.map((item) => {
                if (!this.getItemRatingDataAction(item.item_id, item.provider_name, item.category, item.user_id)) {
                    draftState.push(item)
                }
            })
        })
        this.updateContext({key: "itemRatingsList", value: nextState})
    }

    isSavedItemAction(item_id, provider, category, user_id) {
        const savedItemsList = [...store.getState().search.savedItemsList];
        const isSaved = savedItemsList.filter(savedItem => {
            const getItemFromList = this.getItem(savedItem, item_id, provider, category, user_id);
            if (getItemFromList) {
                return getItemFromList;
            }
        });
        return isSaved.length > 0;
    }

    getItem(item, item_id, provider, category, user_id) {
        if (item === null) {
            return false;
        }
        const savedItemId = this.filterItemIdDataType(item.item_id)
        const itemId = this.filterItemIdDataType(item_id)
        if(
            parseInt(item.user_id) === parseInt(user_id) &&
            savedItemId === itemId &&
            item.provider_name === provider &&
            item.category === category
        ) {
            return item;
        }
        return false;
    }

    getItemRatingDataAction(item_id, provider, category, user_id) {
        const itemRatingsList = [...store.getState().search.itemRatingsList];
        const itemRatingData = itemRatingsList.filter(item => {
            const getItemFromList = this.getItem(item, item_id, provider, category, user_id);
            if (getItemFromList) {
                return getItemFromList;
            }
        });
        if (itemRatingData.length > 0) {
            return itemRatingData[0];
        }
        return false;
    }

    showAuthModal() {
        const authenticated = store.getState().session[SESSION_AUTHENTICATED];
        if (!authenticated) {
            setModalContentAction(
                componentsConfig.components.authentication_login.name,
                {},
                true
            );
            return false;
        }
        return true;
    }


    saveItemAction(provider, category, itemId, user_id) {
        if (!this.showAuthModal()) {
            return;
        }
        const data = {
            provider_name: provider,
            category: category,
            item_id: itemId,
            user_id: user_id
        }
        protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.saveItem),
            data,
            this.saveItemRequestCallback
        )
        this.updateSavedItemAction(data)
    }

    updateSavedItemAction(data) {
        const searchState = {...store.getState().search};
        const nextState = produce(searchState.savedItemsList, (draftState) => {
            if (this.isSavedItemAction(data.item_id, data.provider_name, data.category, data.user_id)) {
                draftState.splice(this.getSavedItemIndexAction(data.item_id, data.provider_name, data.category, data.user_id), 1);
            } else {
                draftState.push(data)
            }
        })
        this.updateContext({key: "savedItemsList", value: nextState})
    }

    getSavedItemIndexAction(item_id, provider, category, user_id) {
        let index;
        const savedItemsList = [...store.getState().search.savedItemsList];
        savedItemsList.map((savedItem, savedItemIndex) => {
            const savedItemId = this.filterItemIdDataType(savedItem.item_id)
            const itemId = this.filterItemIdDataType(item_id)
            if(
                parseInt(savedItem.user_id) === parseInt(user_id) &&
                savedItemId === itemId &&
                savedItem.provider_name === provider &&
                savedItem.category === category
            ) {
                index = savedItemIndex;
            }
        });
        return index;
    }

    saveItemRatingAction(provider, category, itemId, user_id, rating) {
        if (!this.showAuthModal()) {
            return false;
        }
        const data = {
            provider_name: provider,
            category: category,
            item_id: itemId,
            user_id: user_id,
            rating: rating,
        }
        protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.saveItemRating),
            data,
            this.updateItemRatingAction
        )
        this.updateItemRatingAction(data)
    }

    updateItemRatingAction(status, data) {
        if (!isSet(data) || !isSet(data.data) ) {
            return;
        }
        if (Array.isArray(data.data) && data.data.length > 0) {
            const itemData = data.data[0];
            const searchState = {...store.getState().search};
            const nextState = produce(searchState.itemRatingsList, (draftState) => {
                if (this.getItemRatingDataAction(itemData.item_id, itemData.provider_name, itemData.category, itemData.user_id)) {
                    const getIndex = this.getItemRatingIndexAction(itemData.item_id, itemData.provider_name, itemData.category, itemData.user_id);
                    draftState.splice(getIndex, 1);
                }
                draftState.push(itemData)
            })
            this.updateContext({key: "itemRatingsList", value: nextState})
        }
    }

    filterItemIdDataType(itemId) {
        if (!isNaN(itemId)) {
            itemId = parseInt(itemId);
        }
        return itemId;
    }
    getItemRatingIndexAction(item_id, provider, category, user_id) {
        let index;
        const itemRatingsList = [...store.getState().search.itemRatingsList];
        itemRatingsList.map((item, itemIndex) => {
            const savedItemId = this.filterItemIdDataType(item.item_id)
            const itemId = this.filterItemIdDataType(item_id)
            if(
                parseInt(item.user_id) === parseInt(user_id) &&
                savedItemId === itemId &&
                item.provider_name === provider &&
                item.category === category
            ) {
                index = itemIndex;
            }
        });
        return index;
    }

    saveItemRequestCallback(error, data) {
    }

}
