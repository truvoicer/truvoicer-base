import {DataSourceBase} from "@/truvoicer-base/library/listings/engine/source/data-source-base";
import {isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {FetcherApiMiddleware} from "@/truvoicer-base/library/api/fetcher/middleware";
import {
    SEARCH_REQUEST_IDLE,
    SEARCH_REQUEST_NEW,
    PAGE_CONTROL_HAS_MORE,
    PAGE_CONTROL_PAGINATION_REQUEST,
    PAGE_CONTROL_REQ_PAGINATION_TYPE,
    PAGINATION_PAGE_NUMBER, SEARCH_STATUS_COMPLETED,
    SEARCH_REQUEST_ERROR, SEARCH_STATUS_IDLE,
    SEARCH_STATUS_STARTED, SORT_BY, PAGINATION_OFFSET, PAGINATION_PAGE_SIZE, SORT_ORDER, DATE_KEY
} from "@/truvoicer-base/redux/constants/search-constants";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS,
    LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST, LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {REQUEST_POST} from "@/truvoicer-base/library/constants/request-constants";
import {getSiteSettings} from "@/truvoicer-base/library/api/wp/middleware";
import {siteConfig} from "@/config/site-config";
import store from "@/truvoicer-base/redux/store";

export class FetcherDataSource extends DataSourceBase {

    fetcherApiMiddleware = null;
    constructor(listingsEngine, searchEngine) {
        super(listingsEngine, searchEngine);
        this.fetcherApiMiddleware = new FetcherApiMiddleware();
    }

    getCategory(item = null) {
        return item?.service?.name || this.listingsEngine?.listingsContext?.listingsData?.api_listings_service;
    }
    getInitialSearchLimit(data) {
        if (isNotEmpty(data?.posts_per_page) &&
            !isNaN(data.posts_per_page)) {
            return parseInt(data.posts_per_page)
        }
        return siteConfig.defaultSearchLimit;

    }
    getInitialSortBy(data) {
        return data?.[fetcherApiConfig.sortByKey] || null;
    }
    getInitialSortOrder(data) {
        return data?.[fetcherApiConfig.sortOrderKey] || null;
    }
    getInitialDateKey(data) {
        return data?.[fetcherApiConfig.dateKey] || null;
    }
    dataInit(data) {
        this.listingsEngine.updateContext({key: "listingsData", value: data})

        if (!isNotEmpty(data.api_listings_service)) {
            console.warn('Api Listing category not set in block data')
            return false;
        }

        this.listingsEngine.updateContext({key: "category", value: data.api_listings_service})

        this.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_IDLE);
    }

    calculateLimit(providerCount, pageSize = null) {
        if (pageSize === null) {
            pageSize = siteConfig.defaultSearchLimit;
        }
        return Math.floor(pageSize / providerCount);
    }
    async prepareSearch() {
        const searchParams = store.getState().page?.searchParams;

        const data = this.listingsEngine?.listingsContext?.listingsData;

        let query = {};
        if (isObject(this.searchEngine.searchContext.query)) {
            query = {...this.searchEngine.searchContext.query};
        }

        const searchLimit = this.getInitialSearchLimit(data);
        const providers = await this.getSearchProviders();
        const filterProviders = this.searchEngine.filterSearchProviders(providers);

        query["provider"] = filterProviders;
        query["service"] = this.listingsEngine?.listingsContext?.listingsData?.api_listings_service;

        // query[fetcherApiConfig.pageSizeKey] = this.calculateLimit(
        //     filterProviders.length,
        //     query?.[fetcherApiConfig.pageSizeKey]
        // );

        if (this.listingsEngine.isPrimaryListing() && isNotEmpty(searchParams?.sort_by)) {
            query[SORT_BY] = searchParams?.sort_by;
        } else if (!isNotEmpty(query?.[SORT_BY])) {
            query[SORT_BY] = this.getInitialSortBy(data);
        }

        if (this.listingsEngine.isPrimaryListing() && isNotEmpty(searchParams?.sort_order)) {
            query[SORT_ORDER] = searchParams?.sort_order;
        } else if (!isNotEmpty(query?.[SORT_ORDER])) {
            query[SORT_ORDER] = this.getInitialSortOrder(data);
        }

        if (!isNotEmpty(query?.[DATE_KEY])) {
            query[DATE_KEY] = this.getInitialDateKey(data);
        }
        if (!isNotEmpty(query?.['api_fetch_type'])) {
            query['api_fetch_type'] = data?.api_fetch_type || 'database';
        }

        if (this.listingsEngine.isPrimaryListing() && isNotEmpty(searchParams?.page_size)) {
            query[fetcherApiConfig.pageSizeKey] = parseInt(searchParams.page_size);
        } else if (!isNotEmpty(query?.[fetcherApiConfig.pageSizeKey])) {
            query[fetcherApiConfig.pageSizeKey] = searchLimit;
        }

        if (this.listingsEngine.isPrimaryListing() && isNotEmpty(searchParams?.page)) {
            query[PAGINATION_PAGE_NUMBER] = parseInt(searchParams.page);
        } else if (!isNotEmpty(query?.[PAGINATION_PAGE_NUMBER])) {
            query[PAGINATION_PAGE_NUMBER] = 1;
        }

        this.searchEngine.updateContext({key: 'query', value: query});
    }

    async setListingsProviders(data) {
        const response = await this.getListingsProviders(
            data,
            "providers"
        );

        if (!Array.isArray(response?.data?.providers)) {
            this.getListingsEngine().addError(response?.message)
            return false;
        }
        let listingsProviders = [];
        if (Array.isArray(data?.providers_list) && Array.isArray(response?.data?.providers)) {
            listingsProviders = response.data.providers.map(provider => {
                const findProvider = data.providers_list.find(item => item?.provider_name === provider?.name);
                if (findProvider) {
                    return {...provider, ...findProvider};
                }
                return provider;
            })
        } else if (Array.isArray(response?.data?.providers)) {
            listingsProviders = response.data.providers;
        }
        this.listingsEngine.updateContext({key: "providers", value: listingsProviders})
        return listingsProviders
    }

    async runSearch() {
        await this.runFetcherApiListingsSearch()
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
        if (!Array.isArray(this.listingsEngine.listingsContext?.providers)) {
            return false;
        }
        if (!this.listingsEngine.listingsContext?.providers.length) {
            return false;
        }
        if ( this.searchEngine.searchContext.initialRequestHasRun) {
            return false;
        }
        if (this.searchEngine.searchContext?.searchOperation !== SEARCH_REQUEST_IDLE) {
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

        if (!isSet(searchQueryState[fetcherApiConfig.pageSizeKey])) {
            console.warn("No search limit found...")
            return false;
        }
        return true;
    }
    async runFetcherApiListingsSearch() {
        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_STATUS_STARTED);
        const searchQueryState = this.searchEngine.searchContext.query;
        const validate = this.validateSearchParams();
        if (!validate) {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            return false;
        }

        if (!searchQueryState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            this.searchEngine.setQueryItemAction(PAGINATION_PAGE_NUMBER, 1);
        }

        const response = await this.fetcherApiMiddleware.fetchData(
            "operation",
            ['search', 'list'],
            {},
            this.searchEngine.searchContext.query,
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

        this.getUserItemsListAction(results, data[providerResponseKey], data[categoryResponseKey])
        // if (
        //     isNotEmpty(data?.[categoryResponseKey]) &&
        //     isNotEmpty(data?.[providerResponseKey])
        // ) {
        // }
        // if (isNotEmpty(data?.[providerResponseKey])) {
        //     this.searchEngine.setSearchExtraDataAction(data.extraData, data[providerResponseKey], results)
        // }
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
            this.searchEngine.setSearchRequestStatusAction(SEARCH_STATUS_IDLE);
            this.searchEngine.setSearchRequestOperationAction(SEARCH_REQUEST_IDLE);
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
    async getSearchProviders() {
        const queryDataState = this.listingsEngine?.searchContext?.query;
        const listingsContext = await this.listingsEngine?.listingsContext;
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
