import {ListingsEngineBase} from "@/truvoicer-base/library/listings/engine/listings-engine-base";
import {isEmpty, isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS, LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST, LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {
    NEW_SEARCH_REQUEST, PAGINATION_PAGE_NUMBER, PAGE_CONTROL_HAS_MORE,
    PAGINATION_PAGE_SIZE, PAGE_CONTROL_PAGINATION_REQUEST, PAGE_CONTROL_REQ_PAGINATION_TYPE,
    SEARCH_REQUEST_COMPLETED, SEARCH_REQUEST_ERROR, SEARCH_REQUEST_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import store from "@/truvoicer-base/redux/store";
import {siteConfig} from "@/config/site-config";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {SESSION_AUTHENTICATED, SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import React from "react";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {setPostListDataAction} from "@/truvoicer-base/redux/actions/page-actions";
import {extractCategoryIds, extractItemListFromPost} from "@/truvoicer-base/library/helpers/wp-helpers";
import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {blockComponentsConfig} from "@/truvoicer-base/config/block-components-config";
import {WpDataSource} from "@/truvoicer-base/library/listings/engine/source/wp-data-source";
import {FetcherDataSource} from "@/truvoicer-base/library/listings/engine/source/fetcher-data-source";

export class ListingsManager extends ListingsEngineBase {

    constructor(listingsContext, searchContext) {
        super(listingsContext, searchContext);
        this.wpDataSource = new WpDataSource(this.listingsEngine, this.searchEngine);
        this.fetcherDataSource = new FetcherDataSource(this.listingsEngine, this.searchEngine);
    }
    getListingsPostsPerPage() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        const postsPerPage = this.listingsEngine?.listingsContext?.listingsQueryData?.posts_per_page;
        if (isNotEmpty(postsPerPage)) {
            return parseInt(postsPerPage);
        }
        if (isNotEmpty(listingsDataState?.posts_per_page)) {
            return parseInt(listingsDataState.posts_per_page);
        }
        return siteConfig.defaultSearchLimit;
    }
    setListingsBlocksDataAction(data) {
        if (!isObject(data) || isObjectEmpty(data)) {
            return false;
        }

        this.initialisePageControls(data);
        switch (data?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                this.wpDataSource.dataInit(data);
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                this.fetcherDataSource.dataInit(data);
                break;
        }

    }


    getSearchLimit(data) {
        if (isNotEmpty(data?.posts_per_page) &&
            !isNaN(data.posts_per_page)) {
            return parseInt(data.posts_per_page)
        }
        return siteConfig.defaultSearchLimit;

    }

    initialisePageControls(data) {
        const searchLimit = this.getSearchLimit(data);
        this.listingsEngine.addListingsQueryDataString(fetcherApiConfig.searchLimitKey, searchLimit);
        this.searchEngine.setPageControlItemAction(PAGINATION_PAGE_SIZE, searchLimit)
        this.searchEngine.setQueryItemAction(PAGINATION_PAGE_SIZE, searchLimit)
    }

    loadNextPageNumberMiddleware(pageNumber) {
        this.searchEngine.setQueryItemAction(PAGE_CONTROL_PAGINATION_REQUEST, true)
        this.searchEngine.setQueryItemAction(PAGINATION_PAGE_NUMBER, parseInt(pageNumber))
    }

    runSearch(source = null) {
        console.log('runSearch', {source})
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                this.wpDataSource.runSearch(source)
                break;
            case LISTINGS_BLOCK_SOURCE_API:
                this.fetcherDataSource.runSearch(source)
                break;
            default:
                console.warn('Invalid listings source...')
                break;
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
            this.searchEngine.searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
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
