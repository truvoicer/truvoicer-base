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
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/items";
import store from "@/truvoicer-base/redux/store";
import {siteConfig} from "@/config/site-config";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {SESSION_AUTHENTICATED, SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import PostsListingsBlock from "@/truvoicer-base/components/blocks/listings/sources/wp/items/PostsListingsBlock";
import React from "react";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {setPostListDataAction} from "@/truvoicer-base/redux/actions/page-actions";
import {extractCategoryIds} from "@/truvoicer-base/library/helpers/wp-helpers";
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
    setListingsBlocksDataAction(data) {
        if (!isObject(data) || isObjectEmpty(data)) {
            return false;
        }

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
    getListingsProviders(listingsData, endpoint = "providers", callback) {
        switch (listingsData?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                this.wpDataSource.getListingsProviders(listingsData, endpoint = "providers", callback);
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                this.fetcherDataSource.getListingsProviders(listingsData, endpoint = "providers", callback);
                break;
        }
    }


    getSearchLimit() {
        const listingsDataState = this.listingsEngine.listingsContext?.listingsData;
        if (isNotEmpty(listingsDataState?.posts_per_page) &&
            !isNaN(listingsDataState.posts_per_page)) {
            return parseInt(listingsDataState.posts_per_page)
        }
        return siteConfig.defaultSearchLimit;

    }

    initialisePageControls() {
        const searchLimit = this.getSearchLimit();
        this.listingsEngine.addListingsQueryDataString(fetcherApiConfig.searchLimitKey, searchLimit);
        this.searchEngine.setPageControlItemAction(PAGINATION_PAGE_SIZE, searchLimit)
        this.searchEngine.setQueryItemAction(PAGINATION_PAGE_SIZE, searchLimit)
    }

    getListingsInitialLoad() {
        const listingsDataState = this.listingsEngine?.listingsContext.listingsData;
        if (isEmpty(listingsDataState)) {
            console.warn("Listings data empty on initial search...")
            return false;
        }
        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                this.wpDataSource.getInitialLoad(listingsDataState)
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                this.fetcherDataSource.getInitialLoad(listingsDataState)
                break;
        }

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


    getUserItemsListAction(data, provider, category) {
        if (!Array.isArray(data) || data.length === 0) {
            return false;
        }
        const session = {...store.getState().session};

        if (!session[SESSION_AUTHENTICATED]) {
            return;
        }
        const userId = session[SESSION_USER][SESSION_USER_ID]

        const listingsData = this.listingsEngine?.listingsContext?.listingsData;

        let providers = [provider];
        let listPositions = [];
        if (listingsData?.list_start) {
            listPositions.push('list_start');
            if (providers.indexOf("internal") === -1) {
                providers.push("internal");
            }
        }
        if (listingsData?.list_end) {
            listPositions.push('list_end');
            if (providers.indexOf("internal") === -1) {
                providers.push("internal");
            }
        }
        if (listingsData?.custom_position) {
            listPositions.push('custom_position');
            if (providers.indexOf("internal") === -1) {
                providers.push("internal");
            }
        }

        const itemsList = data.map((item) =>  {
            return this.listingsEngine.extractItemId(item);
        })
        const wpListIds = ListingsEngine.getCustomItemsData(listPositions).map((item) =>  {
            return this.listingsEngine.extractItemId(item);
        })

        const requestData = {
            provider_name: providers,
            category: category,
            id_list: [...wpListIds, ...itemsList],
            user_id: userId
        }

        protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.savedItemsList),
            requestData,
            this.getUserItemsListCallback.bind(this)
        )
    }

    getUserItemsListCallback(error, data) {
        if (error) {
            return false;
        }
        this.searchEngine.setSavedItemsListAction(data?.savedItems || []);
        this.searchEngine.setItemRatingsListAction(data?.itemRatings || []);
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
