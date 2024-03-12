import {DataSourceBase} from "@/truvoicer-base/library/listings/engine/source/data-source-base";
import {isNotEmpty, isObject, isSet} from "@/truvoicer-base/library/utils";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {
    NEW_SEARCH_REQUEST,
    PAGE_CONTROL_HAS_MORE,
    PAGE_CONTROL_PAGINATION_REQUEST,
    PAGE_CONTROL_REQ_PAGINATION_TYPE,
    PAGINATION_PAGE_NUMBER, SEARCH_REQUEST_COMPLETED,
    SEARCH_REQUEST_ERROR,
    SEARCH_REQUEST_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS,
    LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST, LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";

export class FetcherDataSource extends DataSourceBase {

    constructor(listingsEngine, searchEngine) {
        super(listingsEngine, searchEngine);
    }
    getProvidersCallback(status, data) {
        if (status === 200) {
            this.listingsEngine.updateListingsData({key: "providers", value: data.data})
            this.listingsEngine.updateContext({key: "providers", value: data.data})
            // this.getListingsInitialLoad();
        } else {
            this.getListingsEngine().addError(data?.message)
        }
    }
    dataInit(data) {
        this.listingsEngine.updateContext({key: "listingsData", value: data})
        if (isNotEmpty(data.api_listings_category)) {
            this.listingsEngine.updateContext({key: "category", value: data.api_listings_category})
            this.getListingsProviders(
                data,
                "providers",
                (status, data) => {
                    this.getProvidersCallback(status, data)
                }
            )
        }
    }
    getInitialLoad(listingsDataState) {

        if (!isSet(listingsDataState.initial_load)) {
            // setSearchError("Initial load data is not set...")
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
        this.searchEngine.setSearchRequestOperationAction(NEW_SEARCH_REQUEST);
        const listingsDataState = this.listingsEngine.listingsContext?.listingsData;
        if (!isSet(listingsDataState.initial_request) || !isSet(listingsDataState.initial_request.request_options)) {
            // setSearchError("Initial request options not set......")
            return false;
        }
        let requestOptions = listingsDataState.initial_request.request_options;
        if (!isSet(requestOptions.request_name) || requestOptions.request_name === null || requestOptions.request_name === "") {
            // setSearchError("Initial request name not set...")
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

    runSearch(source = null) {
        console.log('runSearch', {source})
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        this.runFetcherApiListingsSearch()
    }
    addQueryDataObjectAction(queryData, search = false) {
        let listingsQueryData = this.listingsEngine.listingsContext?.listingsQueryData
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

        const searchQueryState = this.searchEngine.searchContext.query;
        if (!isSet(listingsDataState.listings_category)) {
            console.warn("No category found...")
            // this.setSearchRequestErrorAction("No category found...")
            return false;
        }

        if (!isSet(searchQueryState[fetcherApiConfig.searchLimitKey])) {
            console.warn("No search limit found...")
            return false;
        }
        return true;
    }
    runFetcherApiListingsSearch() {
        console.log('runFetcherApiListingsSearch')
        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
        const searchQueryState = this.searchEngine.searchContext.query;
        const validate = this.validateSearchParams();
        if (!validate) {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            return false;
        }

        if (!searchQueryState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            this.searchEngine.setQueryItemAction(PAGINATION_PAGE_NUMBER, 1);
        }
        const providers = this.getSearchProviders();
        const filterProviders = this.searchEngine.filterSearchProviders(providers);

        filterProviders.map((provider, index) => {
            fetchData(
                "operation",
                [this.searchEngine.getEndpointOperation()],
                this.searchEngine.buildQueryData(
                    filterProviders,
                    provider,
                    this.listingsEngine?.listingsContext?.listingsQueryData
                ),
                this.searchResponseHandler.bind(this),
                (filterProviders.length === index + 1)
            )
        })
    }

    searchResponseHandler(status, data, completed = false) {
        const responseData = data?.data;
        const results = responseData?.results;
        const pagination = responseData?.pagination;

        if (status === 200 && data.status === "success") {
            this.getUserItemsListAction(results, responseData.provider, responseData.category)
            this.searchEngine.setSearchListDataAction(results);
            this.searchEngine.setSearchExtraDataAction(responseData.extraData, data.provider, results)
            this.searchEngine.setSearchRequestServiceAction(responseData.requestService)
            this.searchEngine.setSearchProviderAction(responseData.provider)
            this.searchEngine.setSearchCategoryAction(responseData.category)
            let pageControlData = {
                [PAGE_CONTROL_REQ_PAGINATION_TYPE]: null
            };
            if (isNotEmpty(pagination) && isObject(pagination)) {
                pageControlData = {...pageControlData, ...pagination};
            }
            if (isNotEmpty(responseData?.[PAGE_CONTROL_REQ_PAGINATION_TYPE])) {
                pageControlData[PAGE_CONTROL_REQ_PAGINATION_TYPE] = responseData[PAGE_CONTROL_REQ_PAGINATION_TYPE];
            }
            this.searchEngine.setPageControlsAction(pageControlData)

        } else {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            this.searchEngine.setSearchRequestErrorAction(responseData.message)
        }
        if (completed) {
            // this.searchEngine.setHasMoreSearchPages()
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
            this.searchEngine.setSearchRequestOperationAction(null);
        }
    }
    getSearchProviders() {
        const queryDataState = this.listingsEngine?.listingsContext?.listingsQueryData;
        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;
        let providers = [];
        if (!Array.isArray(queryDataState?.providers) || queryDataState.providers.length === 0) {
            if (Array.isArray(listingsDataState?.providers) && listingsDataState.providers.length) {
                providers = listingsDataState.providers.map(provider => {
                    return provider.name;
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
    getListingsProviders({api_listings_category, select_providers, providers_list}, endpoint = "providers", callback) {
        if (isSet(select_providers) && select_providers && Array.isArray(providers_list)) {
            fetchData("list", [api_listings_category, endpoint], {provider: providers_list}, callback);
        } else {
            fetchData("list", [api_listings_category, endpoint], {}, callback);
        }
    }
}
