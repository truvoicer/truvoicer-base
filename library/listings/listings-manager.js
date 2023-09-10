import {ListingsEngineBase} from "@/truvoicer-base/library/listings/engine/listings-engine-base";
import {isEmpty, isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS
} from "@/truvoicer-base/redux/constants/general_constants";
import {
    NEW_SEARCH_REQUEST, PAGE_CONTROL_CURRENT_PAGE,
    PAGE_CONTROL_PAGE_SIZE, PAGE_CONTROL_PAGINATION_REQUEST,
    SEARCH_REQUEST_COMPLETED, SEARCH_REQUEST_ERROR, SEARCH_REQUEST_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {setSearchError, setSearchOperation} from "@/truvoicer-base/redux/reducers/search-reducer";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/items";
import store from "@/truvoicer-base/redux/store";
import {siteConfig} from "@/config/site-config";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {addArrayItem, addListingsQueryDataString} from "@/truvoicer-base/redux/middleware/listings-middleware";

export class ListingsManager extends ListingsEngineBase {

    constructor(listingsContext, searchContext, itemsContext) {
        super(listingsContext, searchContext, itemsContext);
    }
    setListingsBlocksDataAction(data) {
        if (!isObject(data) || isObjectEmpty(data)) {
            return false;
        }

        if (data !== null) {
            this.listingsEngine.updateContext({key: "listingsData", value: data})
            switch (data?.source) {
                case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                    this.listingsEngine.updateContext({key: "category", value: data.listings_category})
                    this.getListingsInitialLoad();
                    break;
                case LISTINGS_BLOCK_SOURCE_API:
                default:
                    if (isNotEmpty(data.api_listings_category)) {
                        this.listingsEngine.updateContext({key: "category", value: data.api_listings_category})
                        this.listingsEngine.getListingsProviders(
                            data,
                            "providers",
                            (status, data) => {
                                console.log({status, data})
                                this.getProvidersCallback(status, data)
                                }
                            )
                    }
                    break;
            }
        }
    }

    getProvidersCallback(status, data) {
        console.log({status, data})
        if (status === 200) {
            this.listingsEngine.updateListingsData({key: "providers", value: data.data})
            this.listingsEngine.updateContext({key: "providers", value: data.data})
            this.searchEngine.setPageControlItemAction(PAGE_CONTROL_PAGE_SIZE, this.searchEngine.getSearchLimit())
            // this.getListingsInitialLoad();
        } else {
            this.getListingsEngine().addError(data?.message)
        }
    }

    getListingsInitialLoad() {
        console.log('getListingsInitialLoad')
        const listingsDataState = this.listingsEngine?.listingsContext.listingsData;
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
        this.itemsEngine.getUserItemsListAction(listData, siteConfig.internalProviderName, category)
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
                this.searchEngine.updateContext({key: "searchOperation", value: NEW_SEARCH_REQUEST})
                const queryData = this.searchEngine.getInitialSearchQueryData(listingsDataState);
                this.searchEngine.setSearchRequestServiceAction(fetcherApiConfig.searchOperation)
                this.listingsEngine.addQueryDataObjectAction(queryData, true);
                this.runSearch();
                break;
            case "request":
                this.initialRequest();
                break;
        }
    }

    initialRequest() {
        console.log('initialRequest')
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
        this.searchEngine.setSearchRequestServiceAction(requestOptions.request_name)
        this.addQueryDataObjectAction(queryData, false);
        this.runSearch()
    }

    addQueryDataObjectAction(queryData, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData
        let newQueryData = {};
        Object.keys(queryData).map(value => {
            newQueryData[value] = queryData[value];

        });
        const object = Object.assign({}, listingsQueryData, newQueryData);

        this.updateContext({key: "listingsQueryData", value: object})
        if (search) {
            this.runSearch();
        }
    }

    validateSearchParams() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        const listingsQueryData = this.listingsEngine?.listingsContext?.listingsQueryData;
        if (!isSet(listingsDataState.listings_category)) {
            console.log("No category found...")
            this.setSearchRequestErrorAction("No category found...")
            return false;
        }
        if (!isSet(listingsQueryData[fetcherApiConfig.searchLimitKey])) {
            this.listingsEngine.addListingsQueryDataString(fetcherApiConfig.searchLimitKey, fetcherApiConfig.defaultSearchLimit);
        }
        return true;
    }
    runSearch(operation = false) {
        console.log("runSearch")
        this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
        const pageControlsState = this.searchEngine.searchContext.pageControls;
        if (!this.validateSearchParams()) {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            return false;
        }

        if (!pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            this.searchEngine.setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, 1);
        }
        const providers = this.getSearchProviders();
        console.log({providers})
        const filterProviders = this.searchEngine.filterSearchProviders(providers);
        filterProviders.map((provider, index) => {
            fetchData(
                "operation",
                [this.searchEngine.getEndpointOperation()],
                this.searchEngine.buildQueryData(filterProviders, provider, this.listingsEngine?.listingsContext?.listingsQueryData),
                this.searchEngine.searchResponseHandler.bind(this.searchEngine),
                (filterProviders.length === index + 1)
            )
        })
    }

    getSearchProviders() {
        const queryDataState = this.listingsEngine?.listingsContext?.listingsQueryData;
        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;
        let providers = [];
        if (!Array.isArray(queryDataState?.providers) || queryDataState.providers.length === 0) {
            if (Array.isArray(listingsDataState?.providers) && listingsDataState.providers.length) {
                providers = listingsDataState.providers.map(provider => {
                    return provider.provider_name;
                });
                providers.map((provider) => {
                    this.listingsEngine.addArrayItem("providers", provider)
                });
            }
        } else {
            providers = queryDataState.providers.map(provider => {
                return provider;
            });
        }
        return providers
    }
}
