import {
    APPEND_SEARCH_REQUEST,
    NEW_SEARCH_REQUEST,
    PAGINATION_PAGE_NUMBER,
    PAGE_CONTROL_HAS_MORE,
    PAGINATION_PAGE_SIZE,
    PAGE_CONTROL_REQ_PAGINATION_OFFSET,
    PAGE_CONTROL_PAGINATION_REQUEST, PAGE_CONTROL_REQ_PAGINATION_TYPE,
    PAGINATION_TOTAL_ITEMS,
    PAGINATION_TOTAL_PAGES,
    PAGINATION_OFFSET, PAGE_CONTROL_REQ_PAGINATION_PAGE
} from "@/truvoicer-base/redux/constants/search-constants";
import store from "@/truvoicer-base/redux/store";
import {produce} from "immer";
import {isNotEmpty, isSet} from "@/truvoicer-base/library/utils";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {siteConfig} from "@/config/site-config";
import {EngineBase} from "@/truvoicer-base/library/listings/engine/engine-base";
import {ListingsManagerBase} from "@/truvoicer-base/library/listings/listings-manager-base";
import {StateHelpers} from "@/truvoicer-base/library/helpers/state-helpers";

export class SearchEngine extends EngineBase {
    constructor(context) {
        super();
        this.setSearchContext(context)
    }

    setSearchContext(context) {
        this.searchContext = context;
    }
    getInitData() {
        return this.searchContext;
    }
    updateContext({key, value}) {
        switch (this.dataStore) {
            case ListingsManagerBase.DATA_STORE_CONTEXT:
                this.searchContext.updateData({key, value})
                break;
            case ListingsManagerBase.DATA_STORE_STATE:
                StateHelpers.updateStateObject({
                    key,
                    value,
                    setStateObj: this.setState
                })
                break;
            case ListingsManagerBase.DATA_STORE_VAR:
                this.searchContext[key] = value;
                break;
        }
    }

    updateContextNestedObjectData({object, key, value}) {
        switch (this.dataStore) {
            case ListingsManagerBase.DATA_STORE_CONTEXT:
                this.searchContext.updateNestedObjectData({object, key, value});
                break;
            case ListingsManagerBase.DATA_STORE_STATE:
                StateHelpers.updateStateNestedObjectData({
                    object,
                    key,
                    value,
                    setStateObj: this.setState
                })
                break;
            case ListingsManagerBase.DATA_STORE_VAR:
                this.searchContext[object][key] = value;
                break;
        }
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
        const extraDataState = this.searchContext.extraData;
        if (!isNotEmpty(extraData)) {
            return;
        }
        const nextState = produce(extraDataState, (draftState) => {
           let itemCount = null;
            if (Array.isArray(listData)) {
                itemCount = listData.length;
            }
            if (!isSet(draftState[provider])) {
                draftState[provider] = {};
                extraData.item_count = itemCount;
            } else {
                if (Array.isArray(extraDataState?.[provider].item_count)) {
                    extraData.item_count = parseInt(extraDataState[provider].item_count) + parseInt(itemCount)
                }
            }
            draftState[provider] = extraData;
        })
        this.updateContext({key: "extraData", value: nextState})
    }

    setSearchListDataAction(listData) {
        console.log('setSearchListDataAction', {listData})
        const searchState = this.searchContext;
        let searchList = [];
        if (Array.isArray(searchState.searchList)) {
            searchList = [...searchState.searchList];
        }
        if (!Array.isArray(listData) || listData.length === 0) {
            return
        }
        const searchOperation = searchState.searchOperation;
        if (searchOperation === NEW_SEARCH_REQUEST) {
            // this.updateContext({key: "searchOperation", value: APPEND_SEARCH_REQUEST})
            searchList = searchList.splice(0, searchList.length + 1);

        } else if (searchOperation === APPEND_SEARCH_REQUEST) {
        }
        listData.map((item) => {
            searchList.push(item)
        })
        this.updateContext({key: "searchList", value: searchList})
    }

    setLabelsAction(labels) {
        this.updateContext({key: "labels", value: labels})
    }
    setSearchProviderAction(provider) {
        this.updateContext({key: "provider", value: provider})
    }
    setSearchEntity(value) {
        this.updateContext({key: "searchEntity", value})
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


    getEndpointOperation() {
        const searchState = this.searchContext;
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


    buildQueryData(allProviders, queryData = {}) {
        let cloneQueryData = {...queryData};

        cloneQueryData[fetcherApiConfig.searchLimitKey] = this.calculateLimit(allProviders.length, cloneQueryData?.[fetcherApiConfig.searchLimitKey]);
        cloneQueryData = this.addPaginationQueryParameters(cloneQueryData);
        return cloneQueryData;
    }
    buildPostData(provider, service,  queryData = {}) {
        let cloneQueryData = {...queryData};

        cloneQueryData["provider"] = provider;
        cloneQueryData["service"] = service;
        return cloneQueryData;
    }

    calculateLimit(providerCount, pageSize = null) {
        if (pageSize === null) {
            pageSize = siteConfig.defaultSearchLimit;
        }
        return Math.floor(pageSize / providerCount);
    }

    getInitialSearchQueryData(listingsDataState) {
        if (!Array.isArray(listingsDataState?.initial_load_search_params)) {
            // setSearchError("Initial search data is not set on initial search...")
            return false;
        }
        if (!listingsDataState.initial_load_search_params.length) {
            // setSearchError("Initial search data is empty on initial search...")
            return false;
        }
        let initialSearch = listingsDataState.initial_load_search_params;
        if (!isSet(initialSearch.name || !isSet(initialSearch.value))) {
            // setSearchError("Initial search parameters are not set...")
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

    setSearchRequestStatusMiddleware(status) {
        this.updateContext({key: "searchStatus", value: status})
    }
    setSearchRequestOperationMiddleware(operation) {
        this.updateContext({key: "searchOperation", value: operation})
    }

    setPageControlsAction(extraData) {
        // console.log('setPageControlsAction', {extraData})
        let pageControlsState = this.searchContext?.pageControls;
        const hasMorePages = this.hasMore(pageControlsState, extraData);
        const totalItems = this.getTotalItems(pageControlsState, extraData);
        const totalPages = this.getTotalPages(pageControlsState, extraData);

        this.setPageControlObjectAction({
            ...extraData,
            ...{
                [PAGE_CONTROL_HAS_MORE]: hasMorePages,
                [PAGINATION_TOTAL_ITEMS]: totalItems,
                [PAGINATION_TOTAL_PAGES]: totalPages
            }
        });
    }

    setPageControlObjectAction(object) {
        let pageControlsState = this.searchContext?.pageControls;
        const pageControlsObject = Object.assign({}, pageControlsState, object);
        this.updateContext({key: "pageControls", value: pageControlsObject})
    }
    setPageControlItemAction(key, value) {
        let pageControlsState = this.searchContext?.pageControls;
        const pageControlsObject = Object.assign({}, pageControlsState, {
            [key]: value
        });
        this.updateContext({key: "pageControls", value: pageControlsObject})
    }
    setQueryItemAction(key, value) {
        let searchQueryState = this.searchContext?.query;
        const searchQueryObject = Object.assign({}, searchQueryState, {
            [key]: value
        });
        this.updateContext({key: "query", value: searchQueryObject})
    }

    hasMore(pageControlsState, requestPageControls) {
        switch (requestPageControls[PAGE_CONTROL_REQ_PAGINATION_TYPE]) {
            case PAGE_CONTROL_REQ_PAGINATION_OFFSET:
                return this.hasMoreOffsetItems(pageControlsState, requestPageControls);
            case PAGE_CONTROL_REQ_PAGINATION_PAGE:
                return this.hasMorePages(pageControlsState, requestPageControls);
            default:
                return false;
        }
    }
    hasMoreOffsetItems(pageControlsState, requestPageControls) {
        let currentPage = pageControlsState[PAGINATION_PAGE_NUMBER];
        if (isNotEmpty(requestPageControls?.[PAGINATION_PAGE_NUMBER])) {
            currentPage = parseInt(requestPageControls[PAGINATION_PAGE_NUMBER]);
        }
        if (currentPage === 0) {
            return false;
        }
        if (!isNotEmpty(requestPageControls?.[PAGINATION_TOTAL_ITEMS])) {
            return false;
        }

        const totalItems = parseInt(requestPageControls[PAGINATION_TOTAL_ITEMS]);
        if (totalItems === 0) {
            return false;
        }
        if (!isNotEmpty(pageControlsState?.[PAGINATION_PAGE_SIZE])) {
            return false;
        }

        const pageSize = parseInt(pageControlsState[PAGINATION_PAGE_SIZE]);
        if (pageSize === 0) {
            return false;
        }

        return (currentPage * pageSize) < totalItems;

    }
    hasMorePages(pageControlsState, requestPageControls) {
        let currentPage = requestPageControls[PAGINATION_PAGE_NUMBER];
        if (isNotEmpty(requestPageControls?.[PAGINATION_PAGE_NUMBER])) {
            currentPage = parseInt(requestPageControls[PAGINATION_PAGE_NUMBER]);
        }
        if (currentPage === 0) {
            return false;
        }
        return parseInt(requestPageControls[PAGINATION_PAGE_NUMBER]) <= parseInt(requestPageControls[PAGINATION_TOTAL_PAGES]);

    }
    getTotalItems(pageControlsState, requestPageControls) {
        let totalItems = pageControlsState[PAGINATION_TOTAL_ITEMS];
        if (isNaN(totalItems)) {
            totalItems = 0;
        }
        let requestTotalItems = requestPageControls.total_items;

        if (isSet(requestTotalItems) && requestTotalItems !== "" && !isNaN(requestTotalItems)) {
            return totalItems + parseInt(requestTotalItems)
        }
        return totalItems;
    }

    getTotalPages(pageControlsState, requestPageControls) {
        if (
            isSet(requestPageControls?.[PAGINATION_TOTAL_PAGES]) &&
            !isNaN(requestPageControls[PAGINATION_TOTAL_PAGES])
        ) {
            return parseInt(requestPageControls[PAGINATION_TOTAL_PAGES]);
        }
        let totalPages = pageControlsState[PAGINATION_TOTAL_PAGES];

        if (isNaN(totalPages)) {
            totalPages = 0;
        }
        let requestTotalPages;
        if (isSet(requestPageControls.page_number)) {
            requestTotalPages = requestPageControls.page_count;
        } else if (isSet(requestPageControls.page_offset)) {
            requestTotalPages = Math.floor(requestPageControls.total_items / siteConfig.defaultSearchLimit);
        }
        if (isSet(requestTotalPages) && requestTotalPages !== "" && requestTotalPages !== null) {
            return totalPages + parseInt(requestTotalPages)
        }
        return totalPages;
    }

    getCurrentPageFromOffset(pageOffset) {
        const pageControlsState = {...store.getState().search.pageControls}
        let totalItems = pageControlsState[PAGINATION_TOTAL_ITEMS];
        let totalPages = pageControlsState[PAGINATION_TOTAL_PAGES];
        let pageSize = pageControlsState[PAGINATION_PAGE_SIZE];
        let offsetPageCount = Math.floor(totalItems - pageOffset)

        if (pageOffset === 0) {
            return Math.floor(totalPages - Math.floor(totalItems / pageSize)) + 1;
        } else {
            return Math.floor(totalPages - Math.floor((offsetPageCount / pageSize)));
        }
    }

    getOffsetFromPageNUmber(pageNumber) {
        const pageControlsState = {...store.getState().search.pageControls}
        let pageSize = pageControlsState[PAGINATION_PAGE_SIZE];
        return parseInt(pageSize) * parseInt(pageNumber);
    }


    addPaginationQueryParameters(queryData) {
        const searchQueryState = this.searchContext.query;
        const currentPage = searchQueryState[PAGINATION_PAGE_NUMBER];
        let pageSize = siteConfig.defaultSearchLimit

        if (isSet(queryData?.[PAGINATION_PAGE_SIZE])) {
            pageSize = queryData[PAGINATION_PAGE_SIZE];
        }

        queryData[PAGINATION_PAGE_NUMBER] = currentPage;
        queryData[PAGINATION_OFFSET] = pageSize * currentPage;
        return queryData;
    }

    addProviderToSearch(provider) {
        const pageControlsState = this.searchContext?.pageControls;
        const extraData = this.searchContext?.extraData[provider];
        if (!isSet(extraData?.total_items)) {
            return true;
        }
        else if (pageControlsState[PAGINATION_PAGE_NUMBER] === 1) {
            return true;
        }
        else if (isSet(extraData.total_items) && !isNaN(extraData.total_items)) {
            if (this.providerHasMoreItems(
                pageControlsState[PAGINATION_PAGE_NUMBER],
                pageControlsState[PAGINATION_PAGE_SIZE],
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
        const searchState = this.searchContext;
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
        const searchState = this.searchContext;
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
        let savedItemsList = [];
        if (Array.isArray(this.searchContext?.savedItemsList)) {
            savedItemsList = [...this.searchContext?.savedItemsList];
        }
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
        let itemRatingsList = [];
        if (Array.isArray(this.searchContext?.itemRatingsList)) {
            itemRatingsList = [...this.searchContext?.itemRatingsList];
        }
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

    filterItemIdDataType(itemId) {
        if (!isNaN(itemId)) {
            itemId = parseInt(itemId);
        }
        return itemId;
    }

}
