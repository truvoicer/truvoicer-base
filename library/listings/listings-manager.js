import {ListingsManagerBase} from "@/truvoicer-base/library/listings/listings-manager-base";
import {isEmpty, isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS, LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST, LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {
    SEARCH_REQUEST_NEW,
    PAGINATION_PAGE_NUMBER,
    PAGE_CONTROL_HAS_MORE,
    PAGINATION_PAGE_SIZE,
    PAGE_CONTROL_PAGINATION_REQUEST,
    PAGE_CONTROL_REQ_PAGINATION_TYPE,
    SEARCH_STATUS_COMPLETED,
    SEARCH_REQUEST_ERROR,
    SEARCH_STATUS_STARTED,
    SEARCH_REQUEST_APPEND,
    SEARCH_STATUS_IDLE,
    SEARCH_REQUEST_IDLE
} from "@/truvoicer-base/redux/constants/search-constants";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import store from "@/truvoicer-base/redux/store";
import {siteConfig} from "@/config/site-config";
import {SESSION_AUTHENTICATED, SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {blockComponentsConfig} from "@/truvoicer-base/config/block-components-config";
import {WpDataSource} from "@/truvoicer-base/library/listings/engine/source/wp-data-source";
import {FetcherDataSource} from "@/truvoicer-base/library/listings/engine/source/fetcher-data-source";

export class ListingsManager extends ListingsManagerBase {

    constructor(listingsContext = null, searchContext = null) {
        super(listingsContext, searchContext);
        this.initDataSources();
    }
    init(data) {
         this.setListingsBlocksDataAction(data);

        if (!this.validateInitData()) {
            return false;
        }
        return this.validateSearchParams();

    }

    getListingsPostsPerPage() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        const postsPerPage = this.searchEngine?.searchContext?.query?.posts_per_page;
        if (isNotEmpty(postsPerPage)) {
            return parseInt(postsPerPage);
        }
        if (isNotEmpty(listingsDataState?.posts_per_page)) {
            return parseInt(listingsDataState.posts_per_page);
        }
        return siteConfig.defaultSearchLimit;
    }
    setListingsBlocksDataAction(data) {
        //
        // if (!isObjectEmpty(listingsContext?.listingsData)) {
        //     return;
        // }
        if (!isObject(data) || isObjectEmpty(data)) {
            return false;
        }

        let cloneData = {...data}
        if (Array.isArray(cloneData?.listings_category_id)) {
            cloneData.listings_category = cloneData.listings_category_id[0]?.slug
        }

        switch (cloneData?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                this.wpDataSource.dataInit(cloneData);
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                this.fetcherDataSource.dataInit(cloneData);
                break;
        }

    }

    loadNextPageNumberMiddleware(pageNumber) {
        this.searchEngine.setQueryItemAction(PAGE_CONTROL_PAGINATION_REQUEST, true)
        this.searchEngine.setQueryItemAction(PAGINATION_PAGE_NUMBER, parseInt(pageNumber))
    }

    prepareSearch(source = null) {
        console.log('prepareSearch', {source})
        const searchOperation = this.searchEngine.searchContext.searchOperation;
        const searchStatus = this.searchEngine.searchContext.searchStatus;
        if (![SEARCH_REQUEST_NEW, SEARCH_REQUEST_APPEND].includes(searchOperation)) {
            return;
        }
        if (searchStatus !== SEARCH_STATUS_IDLE) {
            return;
        }
        this.searchEngine.setSearchRequestStatusAction(SEARCH_STATUS_STARTED);
    }
    async runSearch(source = null) {
        console.log('runSearch', {source}, this.searchEngine.searchContext)
        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;

        const searchOperation = this.searchEngine.searchContext.searchOperation;
        const searchStatus = this.searchEngine.searchContext.searchStatus;
        if (![SEARCH_REQUEST_NEW, SEARCH_REQUEST_APPEND].includes(searchOperation)) {
            return;
        }
        if (searchStatus !== SEARCH_STATUS_STARTED) {
            return;
        }

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                await this.wpDataSource.runSearch(source)
                break;
            case LISTINGS_BLOCK_SOURCE_API:
                await this.fetcherDataSource.runSearch(source)
                break;
            default:
                console.warn('Invalid listings source...')
                break;
        }
    }

    getCategory() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return this.wpDataSource.getCategory();
            case LISTINGS_BLOCK_SOURCE_API:
                return this.fetcherDataSource.getCategory();
            default:
                return false;
        }
    }
    validateInitData() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return this.wpDataSource.validateInitData();
            case LISTINGS_BLOCK_SOURCE_API:
                return this.fetcherDataSource.validateInitData();
            default:
                return false;
        }
    }
    getListingsProviders({api_listings_service, select_providers, providers_list}, endpoint = "providers", callback) {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return this.wpDataSource.getListingsProviders(
                    {api_listings_service, select_providers, providers_list},
                    endpoint = "providers", callback
                );
            case LISTINGS_BLOCK_SOURCE_API:
                return this.fetcherDataSource.getListingsProviders(
                    {api_listings_service, select_providers, providers_list},
                    endpoint = "providers",
                    callback
                );
            default:
                return false;
        }
    }
    async setListingsProviders({
        api_listings_service,
        select_providers,
        providers_list
    }, endpoint = "providers", callback) {
        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return true;
            case LISTINGS_BLOCK_SOURCE_API:
                return await this.fetcherDataSource.setListingsProviders(
                    {api_listings_service, select_providers, providers_list},
                );
            default:
                return false;
        }
    }
    validateSearchParams() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return this.wpDataSource.validateWpPostsRequestParams();
            case LISTINGS_BLOCK_SOURCE_API:
                return this.fetcherDataSource.validateSearchParams();
            default:
                console.warn('Invalid listings source...')
                return false;
        }
    }


    getListingBlockId() {
        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;
        if (!isNotEmpty(listingsDataState?.listing_block_id)) {
            return null;
        }
        return listingsDataState.listing_block_id;
    }

    canRunSearch(operation) {
        return (
            this.searchEngine.searchContext?.searchStatus !== SEARCH_STATUS_STARTED &&
            this.searchEngine.searchContext?.searchOperation === operation
        )
    }
    showAuthModal(modalContext) {
        const authenticated = store.getState().session[SESSION_AUTHENTICATED];
        if (!authenticated) {
            modalContext.showModal({
                component: blockComponentsConfig.components.authentication_login.name,
                show: true
            });
            return false;
        }
        return true;
    }
}
