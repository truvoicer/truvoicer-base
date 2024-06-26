import {DataSourceBase} from "@/truvoicer-base/library/listings/engine/source/data-source-base";
import {isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {
    DISPLAY_AS,
    LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST,
    LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {
    APPEND_SEARCH_REQUEST,
    INIT_SEARCH_REQUEST,
    NEW_SEARCH_REQUEST,
    PAGE_CONTROL_HAS_MORE,
    PAGE_CONTROL_PAGINATION_REQUEST, PAGE_CONTROL_REQ_PAGINATION_OFFSET,
    PAGE_CONTROL_REQ_PAGINATION_PAGE,
    PAGE_CONTROL_REQ_PAGINATION_TYPE,
    PAGINATION_PAGE_NUMBER,
    SEARCH_REQUEST_COMPLETED,
    SEARCH_REQUEST_ERROR,
    SEARCH_REQUEST_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {siteConfig} from "@/config/site-config";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {extractCategoryIds, extractItemListFromPost} from "@/truvoicer-base/library/helpers/wp-helpers";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {
    ITEM_LIST_ID,
    LISTINGS_REQ_OP,
    LISTINGS_REQ_OP_ITEM_LIST, LISTINGS_REQ_OP_POST_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import {tr} from "date-fns/locale";

export class WpDataSource extends DataSourceBase {
    constructor(listingsEngine, searchEngine) {
        super(listingsEngine, searchEngine);
    }

    dataInit(data) {
        let cloneData = {...data};
        cloneData.providers = [];
        this.listingsEngine.updateContext({key: "listingsData", value: cloneData})
        this.setPostsBlocksDataAction(cloneData);
        this.listingsEngine.updateContext({key: "providers", value: []})
        this.getInitialLoad(cloneData);
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
        this.getSearchEngine().setSearchEntity('listItemsRequestInit');
        this.getSearchEngine().setSearchRequestOperationMiddleware(INIT_SEARCH_REQUEST);
        this.searchEngine.setSearchCategoryAction(category)
        this.listingsEngine.updateContext({key: LISTINGS_REQ_OP, value: LISTINGS_REQ_OP_POST_LIST});
        this.listingsEngine.addListingsQueryDataString('show_all_categories', listingsDataState?.show_all_categories);
        this.listingsEngine.addListingsQueryDataString('categories', category);
        this.listingsEngine.addListingsQueryDataString(PAGE_CONTROL_REQ_PAGINATION_TYPE, PAGE_CONTROL_REQ_PAGINATION_OFFSET);

    }
    listItemsRequestInit(listingsDataState) {
        if (!isNotEmpty(listingsDataState?.item_list_id)) {
            console.error('Invalid item list post data...')
            return;
        }
        const category = listingsDataState.listings_category;
        this.searchEngine.setSearchCategoryAction(category)
        this.searchEngine.setSearchProviderAction(siteConfig.internalProviderName)

        this.getSearchEngine().setSearchEntity('listItemsRequestInit');
        this.getSearchEngine().setSearchRequestOperationMiddleware(INIT_SEARCH_REQUEST);
        const itemListId = parseInt(listingsDataState?.item_list_id);
        this.listingsEngine.updateContext({key: LISTINGS_REQ_OP, value: LISTINGS_REQ_OP_ITEM_LIST});
        this.listingsEngine.addListingsQueryDataString(ITEM_LIST_ID, itemListId);
        this.listingsEngine.addListingsQueryDataString(PAGE_CONTROL_REQ_PAGINATION_TYPE, PAGE_CONTROL_REQ_PAGINATION_PAGE);
        this.listingsEngine.addListingsQueryDataString(DISPLAY_AS, listingsDataState?.display_as);
    }
    validateInitData() {
        if (!isObject(this.listingsEngine.listingsContext?.listingsData)) {
            return false;
        }
        if (isObjectEmpty(this.listingsEngine.listingsContext?.listingsData)) {
            return false;
        }
        if (!Array.isArray(this.listingsEngine.listingsContext?.listingsData?.providers)) {
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
    validateWpPostsRequestParams() {
        const listingsQueryData = this.listingsEngine?.listingsContext?.listingsQueryData;
        const listingsReqOp = this.listingsEngine?.listingsContext?.[LISTINGS_REQ_OP];
        switch (listingsReqOp) {
            case LISTINGS_REQ_OP_POST_LIST:
                break;
            case LISTINGS_REQ_OP_ITEM_LIST:
                if (!isNotEmpty(listingsQueryData[ITEM_LIST_ID])) {
                    console.warn("Item list id not set...");
                    return false;
                }
                break;
            default:
                console.warn("Invalid request operation...")
                return false;
        }
        if (!isSet(listingsQueryData[fetcherApiConfig.searchLimitKey])) {
            console.warn("Search limit not set...");
            return false;
        }
        return true;
    }
    async runSearch(source = null) {
        console.log('runSearch', {source})

        const listingsReqOp = this.listingsEngine?.listingsContext?.[LISTINGS_REQ_OP];

        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
        const searchQueryState = this.searchEngine.searchContext.query;
        if (!this.validateWpPostsRequestParams()) {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            console.error('Search request params invalid...')
            return false;
        }

        if (!searchQueryState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            this.searchEngine.setQueryItemAction(PAGINATION_PAGE_NUMBER, 1);
        }
        let request;
        switch (listingsReqOp) {
            case LISTINGS_REQ_OP_POST_LIST:
                request = await wpResourceRequest({
                    endpoint: wpApiConfig.endpoints.postListRequest,
                    method: 'GET',
                    query: {
                        ...this.listingsEngine?.listingsContext?.listingsQueryData,
                        ...this.searchEngine.addPaginationQueryParameters({}, siteConfig.internalProviderName)
                    }
                });
                break;
            case LISTINGS_REQ_OP_ITEM_LIST:
                request = await wpResourceRequest({
                    endpoint: `${wpApiConfig.endpoints.listRequest}/${this.listingsEngine?.listingsContext?.listingsQueryData[ITEM_LIST_ID]}`,
                    method: 'GET',
                    query: {
                        ...this.listingsEngine?.listingsContext?.listingsQueryData,
                        ...this.searchEngine.addPaginationQueryParameters({}, siteConfig.internalProviderName)
                    }
                });
                break;
            default:
                console.warn("Invalid request operation...")
                return false;
        }
        const response =  await request.json();

        if (response?.status === "success") {
            this.postsRequestResponseHandler(response, true);
        } else {
            this.searchEngine.postsRequestResponseHandler(SEARCH_REQUEST_ERROR);
            this.searchEngine.postsRequestResponseHandler(response?.message)
        }
    }
    postsRequestResponseHandler(data, completed = false) {

        if (data.status !== "success") {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            this.searchEngine.setSearchRequestErrorAction(data.message);
            return;
        }
        switch (this.listingsEngine?.listingsContext?.[LISTINGS_REQ_OP]) {
            case LISTINGS_REQ_OP_ITEM_LIST:
                this.getUserItemsListAction(data?.list, siteConfig.internalProviderName, siteConfig.internalCategory)
                this.searchEngine.setSearchListDataAction(data?.list);
                break;
            case LISTINGS_REQ_OP_POST_LIST:
                this.searchEngine.setSearchListDataAction(data?.postList);
                this.searchEngine.setSearchCategoryAction('posts')
                break;
            default:
                console.warn("Invalid request operation...")
                return false;
        }
        if (isNotEmpty(data?.labels) && isObject(data.labels)) {
            this.searchEngine.setLabelsAction(data.labels);
        }
            // this.getUserItemsListAction(data.request_data, data.provider, data.category)
            // this.searchEngine.setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
            // this.searchEngine.setSearchRequestServiceAction(data.request_service)
            // this.searchEngine.setSearchProviderAction(data.provider)
            let pageControlData = {
                [PAGE_CONTROL_REQ_PAGINATION_TYPE]: null
            };
            if (isNotEmpty(data?.pagination) && isObject(data.pagination)) {
                pageControlData = {...pageControlData, ...data.pagination};
            }
            console.log('postsRequestResponseHandler', {pageControlData})
            this.searchEngine.setPageControlsAction(pageControlData)


        if (completed) {
            // this.searchEngine.setHasMoreSearchPages()

            this.searchEngine.updateContext({key: 'initialRequestHasRun', value: true})
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
