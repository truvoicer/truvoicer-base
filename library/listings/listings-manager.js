import {ListingsManagerBase} from "@/truvoicer-base/library/listings/listings-manager-base";
import {isEmpty, isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {
    LISTINGS_BLOCK_SOURCE_API, LISTINGS_BLOCK_SOURCE_SAVED_ITEMS,
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
import {da} from "date-fns/locale";

export class ListingsManager extends ListingsManagerBase {

    constructor(listingsContext = null, searchContext = null) {
        super(listingsContext, searchContext);
        this.initDataSources();
    }
    canInitialise() {

    }
    init(data) {
         this.setListingsBlocksDataAction(data);

        if (!this.validateInitData()) {
            return false;
        }
        return this.validateSearchParams();

    }
    getSourceByType(type) {
        switch (type) {
            case 'internal':
                return LISTINGS_BLOCK_SOURCE_WORDPRESS;
            case 'external':
                return LISTINGS_BLOCK_SOURCE_API;
            default:
                return false;
        }
    }
    itemUserDataRequest(source, providers) {
        switch (source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return this.wpDataSource.getItemUserData(providers);
            case LISTINGS_BLOCK_SOURCE_API:
                return this.fetcherDataSource.getItemUserData(providers);
            default:
                console.warn('Invalid source...');
                return false;
        }
    }
    userDataRequestForList() {
        const userDataFetchStatus = this.searchEngine.searchContext.userDataFetchStatus;
        if (userDataFetchStatus !== SEARCH_STATUS_STARTED) {
            return;
        }
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return this.wpDataSource.getUserItemsListAction();
            case LISTINGS_BLOCK_SOURCE_API:
            case LISTINGS_BLOCK_SOURCE_SAVED_ITEMS:
                return this.fetcherDataSource.getUserItemsListAction();
            default:
                console.warn('Invalid source...');
                return false;
        }
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
    async setListingsBlocksDataAction(data) {
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
                this.fetcherDataSource.dataInit(cloneData);
                break;
        }

    }

    loadNextPageNumberMiddleware(pageNumber) {
        this.searchEngine.setQueryItemAction(PAGE_CONTROL_PAGINATION_REQUEST, true)
        this.searchEngine.setQueryItemAction(PAGINATION_PAGE_NUMBER, parseInt(pageNumber))
    }

    async prepareSearch(source = null) {

        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;
        const searchOperation = this.searchEngine.searchContext.searchOperation;
        const searchStatus = this.searchEngine.searchContext.searchStatus;

        if (![SEARCH_REQUEST_NEW, SEARCH_REQUEST_APPEND].includes(searchOperation)) {
            return;
        }
        if (searchStatus !== SEARCH_STATUS_IDLE) {
            return;
        }

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_SAVED_ITEMS:
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                await this.wpDataSource.prepareSearch();
                break;
            case LISTINGS_BLOCK_SOURCE_API:
                await this.fetcherDataSource.prepareSearch();
                break;
            default:
                console.warn('Invalid listings source...')
                break;
        }
        this.searchEngine.setSearchRequestStatusAction(SEARCH_STATUS_STARTED);
    }
    async runSearch() {
        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;

        const searchOperation = this.searchEngine.searchContext.searchOperation;
        const searchStatus = this.searchEngine.searchContext.searchStatus;

        const userDataFetchStatus = this.searchEngine.searchContext.userDataFetchStatus;
        if (![SEARCH_REQUEST_NEW, SEARCH_REQUEST_APPEND].includes(searchOperation)) {
            return;
        }
        
        if (searchStatus !== SEARCH_STATUS_STARTED) {
            return;
        }

        if ( userDataFetchStatus !== SEARCH_STATUS_IDLE) {
            return;
        }
        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                await this.wpDataSource.runSearch();
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            case LISTINGS_BLOCK_SOURCE_SAVED_ITEMS:
                await this.fetcherDataSource.runSearch();
                break;
            default:
                console.warn('Invalid listings source...')
                break;
        }
    }

    getCategory(item = null) {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return this.wpDataSource.getCategory(item);
            case LISTINGS_BLOCK_SOURCE_API:
            case LISTINGS_BLOCK_SOURCE_SAVED_ITEMS:
                return this.fetcherDataSource.getCategory(item);
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
            case LISTINGS_BLOCK_SOURCE_SAVED_ITEMS:
                return true;
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
            case LISTINGS_BLOCK_SOURCE_SAVED_ITEMS:
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
            case LISTINGS_BLOCK_SOURCE_SAVED_ITEMS:
                return true;
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

    getDataKeyValue(item, key) {
        const listingsData = this.listingsEngine?.listingsContext?.listingsData;
        if (
            isNotEmpty(key) &&
            isNotEmpty(item?.[listingsData[key]])
        ) {
            return item[listingsData[key]];
        }
        return null;
    }

    getThumbnail(item) {
        const listingsData = this.listingsEngine?.listingsContext?.listingsData;
        
        let data = {
            type: listingsData?.thumbnail_type,
        }
        switch (listingsData?.thumbnail_type) {
            case 'image':
                if (isNotEmpty(listingsData?.thumbnail_url)) {
                    data.value = listingsData.thumbnail_url;
                    return data;
                }
                break;
            case 'data_key':
                return this.getDataKeyValue(item, listingsData?.thumbnail_key);
            case 'bg':
                if (isNotEmpty(listingsData?.thumbnail_bg)) {
                    data.value = listingsData.thumbnail_bg;
                    return data;
                }
                break;
        }
        return null;
    }

    getThumbnailImgStyle() {
        let styleObject = {};
        const listingsData = this.listingsEngine?.listingsContext?.listingsData;
        const thumbnailWidth = listingsData?.thumbnail_width;
        const thumbnailHeight = listingsData?.thumbnail_height;
        if (thumbnailWidth) {
            styleObject.width = parseInt(thumbnailWidth);
        }
        if (thumbnailHeight) {
            styleObject.height = parseInt(thumbnailHeight);
        }
        return styleObject;
    }
}
