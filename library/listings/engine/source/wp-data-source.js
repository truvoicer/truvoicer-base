import {DataSourceBase} from "@/truvoicer-base/library/listings/engine/source/data-source-base";
import {isNotEmpty, isObject, isSet} from "@/truvoicer-base/library/utils";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS,
    LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST,
    LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/items";
import {
    NEW_SEARCH_REQUEST,
    PAGE_CONTROL_HAS_MORE, PAGE_CONTROL_PAGINATION_REQUEST, PAGE_CONTROL_REQ_PAGINATION_TYPE, PAGINATION_PAGE_NUMBER,
    SEARCH_REQUEST_COMPLETED, SEARCH_REQUEST_ERROR, SEARCH_REQUEST_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {siteConfig} from "@/config/site-config";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {extractCategoryIds} from "@/truvoicer-base/library/helpers/wp-helpers";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";

export class WpDataSource extends DataSourceBase {
    constructor(listingsEngine, searchEngine) {
        super(listingsEngine, searchEngine);
    }

    dataInit(data) {
        this.listingsEngine.updateContext({key: "listingsData", value: data})
        this.setPostsBlocksDataAction(data);
        this.listingsEngine.updateListingsData({key: "providers", value: []})
        this.listingsEngine.updateContext({key: "providers", value: []})
    }
    getInitialLoad(listingsData) {
        switch (listingsData?.wordpress_data_source) {
            case LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST:
                this.listItemsRequestInit(listingsData)
                break;
            case LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS:
                this.postRequestInit(listingsData)
                break;
        }

    }

    postRequestInit(listingsDataState) {
        this.searchEngine.setSearchRequestOperationAction(NEW_SEARCH_REQUEST);
        const category = listingsDataState?.category_id;
        // this.getUserItemsListAction(listData, siteConfig.internalProviderName, category)
        // this.searchEngine.setSearchListDataAction(listData);
        this.searchEngine.setSearchCategoryAction(category)
        // this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
        this.runSearch('postRequestInit');
    }
    listItemsRequestInit(listingsDataState) {
        if (!isNotEmpty(listingsDataState?.item_list_id)) {
            console.error('Invalid item list post data...')
            return;
        }
        // let listData = extractItemListFromPost({post: listingsDataState?.item_list_id});
        // if (!listData) {
        //     console.error('Invalid item list post data...')
        //     listData = [];
        // }
        // this.searchEngine.setSearchRequestOperationAction(NEW_SEARCH_REQUEST);
        // const category = listingsDataState.listings_category;
        // this.getUserItemsListAction(listData, siteConfig.internalProviderName, category)
        // this.searchEngine.setSearchListDataAction(listData);
        // this.searchEngine.setSearchCategoryAction(category)
        // this.searchEngine.setSearchProviderAction(siteConfig.internalProviderName)
        // this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
        // setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
        // setSearchRequestServiceAction(data.request_service)
        // setPageControlsAction(data.extra_data)
        const itemListId = parseInt(listingsDataState?.item_list_id);
        console.log('listItemsRequestInit', {itemListId})
        // this.runSearch('listItemsRequestInit');
    }
    validateWpPostsRequestParams() {
        const listingsQueryData = this.listingsEngine?.listingsContext?.listingsQueryData;
        if (!isSet(listingsQueryData[fetcherApiConfig.searchLimitKey])) {
            this.listingsEngine.addListingsQueryDataString(fetcherApiConfig.searchLimitKey, siteConfig.defaultSearchLimit);
        }
        return true;
    }
    runSearch(source = null) {
        console.log('runSearch', {source})
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
        const searchQueryState = this.searchEngine.searchContext.query;
        const validate = this.validateWpPostsRequestParams();
        if (!validate) {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            console.error("Invalid search params...")
            return false;
        }

        if (!searchQueryState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            this.searchEngine.setQueryItemAction(PAGINATION_PAGE_NUMBER, 1);
        }

        wpResourceRequest({
            endpoint: wpApiConfig.endpoints.postListRequest,
            method: 'POST',
            data: {
                ...this.listingsEngine?.listingsContext?.listingsQueryData,
                ...{
                    posts_per_page: this.getListingsPostsPerPage(),
                    show_all_categories: listingsDataState?.show_all_categories,
                    categories: extractCategoryIds(listingsDataState?.category_id),
                    pagination_type: 'offset'

                    // page_number: isNotEmpty(pageNumber) ? parseInt(pageNumber) : 1
                }
            }
        })
            .then(response => {
                this.postsRequestResponseHandler(response, true);
            })
            .catch(error => {
                console.error(error)
            })
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
    postsRequestResponseHandler(response, completed = false) {

        if (response?.status === 200 && response?.data.status === "success") {
            // this.getUserItemsListAction(data.request_data, data.provider, data.category)
            this.searchEngine.setSearchListDataAction(response?.data?.postList);
            // this.searchEngine.setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
            // this.searchEngine.setSearchRequestServiceAction(data.request_service)
            // this.searchEngine.setSearchProviderAction(data.provider)
            this.searchEngine.setSearchCategoryAction('posts')
            let pageControlData = {
                [PAGE_CONTROL_REQ_PAGINATION_TYPE]: null
            };
            if (isNotEmpty(response?.data?.pagination) && isObject(response?.data.pagination)) {
                pageControlData = {...pageControlData, ...response?.data.pagination};
            }
            this.searchEngine.setPageControlsAction(pageControlData)

        } else {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            this.searchEngine.setSearchRequestErrorAction(response?.data.message)
        }
        if (completed) {
            // this.searchEngine.setHasMoreSearchPages()
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
            this.searchEngine.setSearchRequestOperationAction(null);
        }
    }

    setPostsBlocksDataAction(data) {
        switch (data?.wordpress_data_source) {
            case LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST:
                this.listingsEngine.updateContext({key: "category", value: data?.listings_category})
                break;
            case LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS:
                this.listingsEngine.updateContext({key: "category", value: data?.category_id})
                break;
        }
    }
    getListingsProviders({api_listings_category, select_providers, providers_list}, endpoint = "providers", callback) {

    }
}
