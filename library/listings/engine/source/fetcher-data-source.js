import {DataSourceBase} from "@/truvoicer-base/library/listings/engine/source/data-source-base";
import {isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {FetcherApiMiddleware} from "@/truvoicer-base/library/api/fetcher/middleware";
import {
    INIT_SEARCH_REQUEST,
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
import {REQUEST_POST} from "@/truvoicer-base/library/constants/request-constants";
import {getSiteSettings} from "@/truvoicer-base/library/api/wp/middleware";

export class FetcherDataSource extends DataSourceBase {

    fetcherApiMiddleware = null;
    constructor(listingsEngine, searchEngine) {
        super(listingsEngine, searchEngine);
        this.fetcherApiMiddleware = new FetcherApiMiddleware();
    }
    getProvidersCallback(status, data) {
        console.log('getProvidersCallback', {status, data})
        if (status === 'success') {
            this.listingsEngine.updateListingsData({key: "providers", value: data.data})
            this.listingsEngine.updateContext({key: "providers", value: data.data})
            // this.getListingsInitialLoad();
        } else {
            this.getListingsEngine().addError(data?.message)
        }
    }
    async dataInit(data) {
        this.listingsEngine.updateContext({key: "listingsData", value: data})

        if (!isNotEmpty(data.api_listings_service)) {
            console.warn('Api Listing category not set in block data')
            return false;
        }
        this.listingsEngine.updateContext({key: "category", value: data.api_listings_service})

        const response = await this.getListingsProviders(
            data,
            "providers"
        );
        if (!Array.isArray(response?.data)) {
            this.getListingsEngine().addError(response?.message)
        }
        let listingsProviders = [];
        if (Array.isArray(data?.providers_list)) {
            listingsProviders = response.data.map(provider => {
                const findProvider = data.providers_list.find(item => item?.provider_name === provider?.name);
                if (findProvider) {
                    return {...provider, ...findProvider};
                }
                return provider;
            })
        } else {
            listingsProviders = response.data;
        }
        this.listingsEngine.updateContext({key: "providers", value: listingsProviders})
        this.getSearchEngine().setSearchRequestOperationMiddleware(INIT_SEARCH_REQUEST);
    }

    runSearch(source = null) {
        console.log('runSearch', {source})
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        this.runFetcherApiListingsSearch()
    }

    validateInitData() {
        if (!isObject(this.listingsEngine.listingsContext?.listingsData)) {
            return false;
        }
        if (isObjectEmpty(this.listingsEngine.listingsContext?.listingsData)) {
            return false;
        }
        if (!Array.isArray(this.listingsEngine.listingsContext?.listingsData?.providers_list)) {
            return false;
        }
        if ( this.searchEngine.searchContext.initialRequestHasRun) {
            return false;
        }
        if (this.searchEngine.searchContext?.searchOperation !== INIT_SEARCH_REQUEST) {
            return false;
        }
        return true;
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
    async runFetcherApiListingsSearch() {
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
        console.log({filterProviders, providers})
        const response = await this.fetcherApiMiddleware.fetchData(
            "operation",
            ['search', 'list'],
            this.searchEngine.buildQueryData(
                filterProviders,
                this.listingsEngine?.listingsContext?.listingsQueryData
            ),
            this.searchEngine.buildPostData(
                filterProviders,
                this.listingsEngine?.listingsContext?.listingsData?.api_listings_service,
                this.listingsEngine?.listingsContext?.listingsQueryData
            ),
            REQUEST_POST
        );
        if (response?.status === "success") {
            this.searchResponseHandler(response.data, true);
        } else {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            this.searchEngine.setSearchRequestErrorAction(response?.message)
        }

    }

    searchResponseHandler(data, completed = false) {
        const results = data?.results;
        const pagination = data?.pagination;

        const categoryResponseKey = fetcherApiConfig.responseKeys.category;
        const providerResponseKey = fetcherApiConfig.responseKeys.provider;
        const serviceRequestResponseKey = fetcherApiConfig.responseKeys.serviceRequest;
        if (
            isNotEmpty(data?.[categoryResponseKey]) &&
            isNotEmpty(data?.[providerResponseKey])
        ) {
            this.getUserItemsListAction(results, data[providerResponseKey], data[categoryResponseKey])
        }
        if (isNotEmpty(data?.[categoryResponseKey])) {
            this.searchEngine.setSearchCategoryAction(data[categoryResponseKey])
        }
        if (isNotEmpty(data?.[providerResponseKey])) {
            this.searchEngine.setSearchProviderAction(data.provider)
        }
        if (isNotEmpty(data?.[providerResponseKey])) {
            this.searchEngine.setSearchExtraDataAction(data.extraData, data[providerResponseKey], results)
        }
        if (isNotEmpty(data?.[serviceRequestResponseKey]?.name)) {
            this.searchEngine.setSearchRequestServiceAction(data[serviceRequestResponseKey].name)
        }
        this.searchEngine.setSearchListDataAction(results);

        let pageControlData = {
            [PAGE_CONTROL_REQ_PAGINATION_TYPE]: null
        };
        if (isNotEmpty(pagination) && isObject(pagination)) {
            pageControlData = {...pageControlData, ...pagination};
        }
        if (isNotEmpty(data?.[PAGE_CONTROL_REQ_PAGINATION_TYPE])) {
            pageControlData[PAGE_CONTROL_REQ_PAGINATION_TYPE] = data[PAGE_CONTROL_REQ_PAGINATION_TYPE];
        }
        this.searchEngine.setPageControlsAction(pageControlData)

        if (completed) {
            // this.searchEngine.setHasMoreSearchPages()
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
            this.searchEngine.setSearchRequestOperationAction(null);
        }
    }
    buildProviderPostData(providers = []) {
        const listingsContext = this.listingsEngine?.listingsContext;
        return providers.map(provider => {
            const findProvider = listingsContext.providers.find(item => item?.name === provider);
            if (findProvider) {
                return findProvider;
            }
            return false;
        }).filter(provider => isObject(provider) && !isObjectEmpty(provider));
    }
    getSearchProviders() {
        const queryDataState = this.listingsEngine?.listingsContext?.listingsQueryData;
        const listingsContext = this.listingsEngine?.listingsContext;
        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;
        let providers = [];
        if (!Array.isArray(queryDataState?.providers) || queryDataState.providers.length === 0) {
            if  (
                Array.isArray(listingsContext?.providers) &&
                listingsContext.providers.length
            )  {
                providers = listingsContext.providers;
            } else if  (
                Array.isArray(listingsDataState?.providers_list) &&
                listingsDataState.providers_list.length
            )  {
                providers = listingsDataState.providers_list;
            }
        } else {
            providers = this.buildProviderPostData(queryDataState.providers)
        }
        return providers
    }
    async getListingsProviders({
        api_listings_service,
        select_providers,
        providers_list
    }, endpoint = "providers") {
        let query = {};
        if (isSet(select_providers) && select_providers && Array.isArray(providers_list)) {
            query = {
                provider: providers_list.map(provider => provider?.provider_name)
            };
        }
        return await this.fetcherApiMiddleware.fetchData("list", [api_listings_service, endpoint], query);
    }
}
