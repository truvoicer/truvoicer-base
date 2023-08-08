import {isSet} from "underscore";
import {siteConfig} from "@/config/site-config";
import {LISTINGS_GRID_COMPACT} from "@/truvoicer-base/redux/constants/listings-constants";
import store from "@/truvoicer-base/redux/store";
import {
    setCategory,
    setListingsData,
    setListingsDataProviders,
    setListingsError, setListingsGrid, setListingsQueryData, setListingsScrollTop
} from "@/truvoicer-base/redux/reducers/listings-reducer";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS
} from "@/truvoicer-base/redux/constants/general_constants";
import {getListingsInitialLoad} from "@/truvoicer-base/redux/actions/listings-actions";
import {isEmpty, isNotEmpty} from "@/truvoicer-base/library/utils";
import {getListingsProviders, getProvidersCallback} from "@/truvoicer-base/redux/middleware/listings-middleware";
import {setSearchError, setSearchOperation} from "@/truvoicer-base/redux/reducers/search-reducer";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {getSearchLimit, setPageControlItemAction} from "@/truvoicer-base/redux/actions/pagination-actions";
import {
    NEW_SEARCH_REQUEST,
    PAGE_CONTROL_PAGE_SIZE,
    SEARCH_REQUEST_COMPLETED
} from "@/truvoicer-base/redux/constants/search-constants";
import {
    initialSearch,
    runSearch,
    setSearchCategoryAction,
    setSearchListDataAction, setSearchProviderAction, setSearchRequestServiceAction, setSearchRequestStatusAction
} from "@/truvoicer-base/redux/actions/search-actions";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/items";
import {getUserItemsListAction} from "@/truvoicer-base/redux/actions/user-stored-items-actions";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {SearchEngine} from "@/truvoicer-base/library/search/search-engine";

export class ListingsEngine {
    constructor() {
        this.listingsData = {
            category: "",
            listingsGrid: isSet(siteConfig.defaultGridSize) ? siteConfig.defaultGridSize : LISTINGS_GRID_COMPACT,
            listingsData: {},
            listingsQueryData: {},
            listingsSearchResults: {},
            listingsRequestStatus: "",
            listingsScrollTop: false,
            error: {},
            updateData: () => {
            }
        };
        this.searchEngine = new SearchEngine();
    }

    setListingsBlocksDataAction(data) {
        if (!isSet(data)) {
            return false;
        }
        if (data !== null) {
            store.dispatch(setListingsData(data))
            switch (data?.source) {
                case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                    store.dispatch(setCategory(data.listings_category))
                    this.getListingsInitialLoad();
                    break;
                case LISTINGS_BLOCK_SOURCE_API:
                default:
                    if (isNotEmpty(data.api_listings_category)) {
                        store.dispatch(setCategory(data.api_listings_category))
                        this.getListingsProviders(data, "providers", this.getProvidersCallback)
                    }
                    break;
            }
        }
    }


    getListingsInitialLoad() {
        const listingsDataState = store.getState().listings.listingsData;
        if (isEmpty(listingsDataState)) {
            setSearchError("Listings data empty on initial search...")
            return false;
        }
        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                this.postsListingsInitialLoad(listingsDataState)
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                this.apiListingsInitialLoad(listingsDataState)
                break;
        }

    }

    getListingsProviders({api_listings_category, select_providers, providers_list}, endpoint = "providers", callback) {
        if (isSet(select_providers) && select_providers && Array.isArray(providers_list)) {
            fetchData("list", [api_listings_category, endpoint], {provider: providers_list}, callback);
        } else {
            fetchData("list", [api_listings_category, endpoint], {}, callback);
        }
    }

    getProvidersCallback(status, data) {
        if (status === 200) {
            store.dispatch(setListingsDataProviders(data.data))
            this.searchEngine.setPageControlItemAction(PAGE_CONTROL_PAGE_SIZE, this.searchEngine.getSearchLimit())
            this.getListingsInitialLoad();
        } else {
            store.dispatch(setListingsError(data.message))
        }
    }

    addArrayItem(key, value, search = false) {
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

    removeArrayItem(key, value, search = false) {
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
                this.searchEngine.runSearch();
            }
        }
    }

    addListingsQueryDataString(key, value, search = false) {
        return function (dispatch) {
            let listingsQueryData = {...store.getState().listings.listingsQueryData}

            const object = Object.assign({}, listingsQueryData, {
                [key]: value
            });
            dispatch(setListingsQueryData(object))
            if (search) {
                this.searchEngine.runSearch();
            }
        }
    }

    addQueryDataObjectMiddleware(queryData, search = false) {
        return function (dispatch) {
            let listingsQueryData = {...store.getState().listings.listingsQueryData}
            let newQueryData = {};
            Object.keys(queryData).map(value => {
                newQueryData[value] = queryData[value];

            });
            const object = Object.assign({}, listingsQueryData, newQueryData);

            dispatch(setListingsQueryData(object))
            if (search) {
                this.searchEngine.runSearch();
            }
        }
    }

    setListingsGridMiddleware(listingsGrid) {
        return function (dispatch) {
            dispatch(setListingsGrid(listingsGrid))
        }
    }

    addQueryDataString(key, value, search = false) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}

        const object = Object.assign({}, listingsQueryData, {
            [key]: value
        });
        store.dispatch(setListingsQueryData(object))
        if (search) {
            this.searchEngine.runSearch();
        }
    }

    addQueryDataObjectAction(queryData, search = false) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}
        let newQueryData = {};
        Object.keys(queryData).map(value => {
            newQueryData[value] = queryData[value];

        });
        const object = Object.assign({}, listingsQueryData, newQueryData);

        store.dispatch(setListingsQueryData(object))
        if (search) {
            this.searchEngine.runSearch();
        }
    }

    setListingsGridAction(listingsGrid) {
        store.dispatch(setListingsGrid(listingsGrid))
    }

    setListingsScrollTopAction(show) {
        store.dispatch(setListingsScrollTop(show))
    }

    getListingsInitialLoad() {
        const listingsDataState = store.getState().listings.listingsData;
        if (isEmpty(listingsDataState)) {
            setSearchError("Listings data empty on initial search...")
            return false;
        }
        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                this.postsListingsInitialLoad(listingsDataState)
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                this.apiListingsInitialLoad(listingsDataState)
                break;
        }

    }

    postsListingsInitialLoad(listingsDataState) {
        console.log({listingsDataState})
        if (!Array.isArray(listingsDataState?.item_list_id)) {
            return;
        }
        let listData = extractItemListFromPost({post: listingsDataState?.item_list_id});
        if (!listData) {
            console.error('Invalid item list post data...')
            listData = [];
        }
        store.dispatch(setSearchOperation(NEW_SEARCH_REQUEST));
        const category = listingsDataState.listings_category;
        getUserItemsListAction(listData, siteConfig.internalProviderName, category)
        this.searchEngine.setSearchListDataAction(listData);
        this.searchEngine.setSearchCategoryAction(category)
        this.searchEngine.setSearchProviderAction(siteConfig.internalProviderName)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
        // setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
        // setSearchRequestServiceAction(data.request_service)
        // setPageControlsAction(data.extra_data)
    }

    apiListingsInitialLoad(listingsDataState) {
        if (!isSet(listingsDataState.initial_load)) {
            setSearchError("Initial load data is not set...")
            return false;
        }
        switch (listingsDataState.initial_load) {
            case "search":
                this.initialSearch();
                break;
            case "request":
                this.initialRequest();
                break;
        }
    }


    initialRequest() {
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

}
