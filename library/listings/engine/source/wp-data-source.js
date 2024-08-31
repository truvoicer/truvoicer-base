import {DataSourceBase} from "@/truvoicer-base/library/listings/engine/source/data-source-base";
import {isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {
    DISPLAY_AS,
    LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST,
    LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {
    PAGE_CONTROL_HAS_MORE,
    PAGE_CONTROL_PAGINATION_REQUEST,
    PAGE_CONTROL_REQ_PAGINATION_OFFSET,
    PAGE_CONTROL_REQ_PAGINATION_PAGE,
    PAGE_CONTROL_REQ_PAGINATION_TYPE, PAGINATION_OFFSET,
    PAGINATION_PAGE_NUMBER,
    PAGINATION_PAGE_SIZE,
    SEARCH_REQUEST_ERROR,
    SEARCH_REQUEST_IDLE,
    SEARCH_REQUEST_NEW,
    SEARCH_STATUS_IDLE,
    SEARCH_STATUS_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {siteConfig} from "@/config/site-config";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {
    ITEM_LIST_ID,
    LISTINGS_REQ_OP,
    LISTINGS_REQ_OP_ITEM_LIST,
    LISTINGS_REQ_OP_POST_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {REQUEST_POST} from "@/truvoicer-base/library/constants/request-constants";

export class WpDataSource extends DataSourceBase {
    constructor(listingsEngine, searchEngine) {
        super(listingsEngine, searchEngine);
    }

    async getItemUserData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return false;
        }
        return  await this.getUserItemDataRequest(this.buildGroupedItemsListByProviderService(data))
    }

    async getUserItemsListAction() {
        if (!Array.isArray(this.searchContext.searchList)) {
            return;
        }
        if (!this.searchContext.searchList.length) {
            return;
        }
        const searchList = [...this.searchContext.searchList];

        let {providers, listPositions} = this.getListingsDataForInternalUserItemDataRequest();
        const response = await this.getUserItemDataRequest([
            ...providers,
            ...this.buildGroupedItemsListByProviderService(searchList),
            ...this.buildGroupedItemsListByProviderService(ListingsEngine.getCustomItemsData(listPositions))
        ])

        this.userItemsDataListResponseHandler(response);
    }
    buildGroupedItemsListByProviderService(data) {
        let providers = [];
        data.forEach((item) => {
            let findProviderIndex = providers.findIndex((provider) => {
                return (
                    provider.provider === item.provider &&
                    provider.service === item?.service?.name
                );
            });
            if (findProviderIndex === -1) {
                providers.push({
                    provider: item.provider,
                    service: item?.service?.name,
                    ids: [this.listingsEngine.extractItemId(item)]
                });
                return;
            }
            providers[findProviderIndex].ids.push(this.listingsEngine.extractItemId(item));
        })
        return providers;
    }
    getCategory(item = null) {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        if (Array.isArray(listingsDataState?.listings_category_id)) {
            return listingsDataState.listings_category_id[0]?.slug
        }
        return null;
    }
    getSearchLimit(data) {
        if (isNotEmpty(data?.posts_per_page) &&
            !isNaN(data.posts_per_page)) {
            return parseInt(data.posts_per_page)
        }
        return siteConfig.defaultSearchLimit;

    }
    dataInit(data) {
        let cloneData = {...data};
        cloneData.providers = [];
        this.listingsEngine.updateContext({key: "listingsData", value: cloneData})
        this.setPostsBlocksDataAction(cloneData);
        this.listingsEngine.updateContext({key: "providers", value: []})
    }

    prepareSearch() {
        switch (this.listingsEngine?.listingsContext?.listingsData?.wordpress_data_source) {
            case LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST:
                this.listItemsRequestInit()
                break;
            case LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS:
                this.postRequestInit()
                break;
        }
    }

    postRequestInit() {
        this.searchEngine.setSearchRequestOperationAction(SEARCH_REQUEST_NEW);
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        const category = listingsDataState?.category_id;

        const searchLimit = this.getSearchLimit(this.listingsEngine.listingsContext?.listingsData);

        this.getSearchEngine().setSearchEntity('listItemsRequestInit');
        this.searchEngine.setSearchCategoryAction(category)
        this.listingsEngine.updateContext({key: LISTINGS_REQ_OP, value: LISTINGS_REQ_OP_POST_LIST});

        let query = {};
        if (isObject(this.searchEngine.searchContext.query)) {
            query = {...this.searchEngine.searchContext.query};
        }
        query['show_all_categories'] = listingsDataState?.show_all_categories;
        query['categories'] = category;
        query[PAGE_CONTROL_REQ_PAGINATION_TYPE] = PAGE_CONTROL_REQ_PAGINATION_OFFSET;

        if (!isNotEmpty(query?.[fetcherApiConfig.pageSizeKey])) {
            query[fetcherApiConfig.pageSizeKey] = searchLimit;
        }

        if (!isSet(query?.[PAGINATION_PAGE_NUMBER])) {
            query[PAGINATION_PAGE_NUMBER] = 1;
        }
        if (!isSet(query?.[PAGINATION_OFFSET])) {
            query[PAGINATION_OFFSET] = 0;
        }

        this.searchEngine.updateContext({key: 'query', value: query});

    }
    listItemsRequestInit() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        if (!isNotEmpty(listingsDataState?.item_list_id)) {
            console.error('Invalid item list post data...')
            return;
        }

        const searchLimit = this.getSearchLimit(this.listingsEngine.listingsContext?.listingsData);

        let query = {};
        if (isObject(this.searchEngine.searchContext.query)) {
            query = {...this.searchEngine.searchContext.query};
        }

        this.listingsEngine.updateContext({key: LISTINGS_REQ_OP, value: LISTINGS_REQ_OP_ITEM_LIST});

        this.searchEngine.setSearchCategoryAction(listingsDataState?.listings_category)
        this.searchEngine.setSearchProviderAction(siteConfig.internalProviderName)

        this.getSearchEngine().setSearchEntity('listItemsRequestInit');

        query[ITEM_LIST_ID] = parseInt(listingsDataState?.item_list_id);
        query[PAGE_CONTROL_REQ_PAGINATION_TYPE] = PAGE_CONTROL_REQ_PAGINATION_PAGE;
        query[DISPLAY_AS] = listingsDataState?.display_as;

        if (!isNotEmpty(query?.[fetcherApiConfig.pageSizeKey])) {
            query[fetcherApiConfig.pageSizeKey] = searchLimit;
        }

        if (!isSet(query?.[PAGINATION_PAGE_NUMBER])) {
            query[PAGINATION_PAGE_NUMBER] = 1;
        }
        if (!isSet(query?.[PAGINATION_OFFSET])) {
            query[PAGINATION_OFFSET] = 0;
        }

        this.searchEngine.updateContext({key: 'query', value: query});
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
        if (this.searchEngine.searchContext?.searchOperation !== SEARCH_REQUEST_IDLE) {
            return false;
        }
        return true;
    }
    validateWpPostsRequestParams() {
        const listingsQueryData = this.searchEngine?.searchContext?.query;

        const listingsReqOp = this.listingsEngine?.listingsContext?.[LISTINGS_REQ_OP];
        switch (listingsReqOp) {
            case LISTINGS_REQ_OP_POST_LIST:
                break;
            case LISTINGS_REQ_OP_ITEM_LIST:
                if (!isNotEmpty(listingsQueryData?.[ITEM_LIST_ID])) {
                    console.warn("Item list id not set...");
                    return false;
                }
                break;
            default:
                console.warn("Invalid request operation...")
                return false;
        }
        if (!isSet(listingsQueryData[fetcherApiConfig.pageSizeKey])) {
            console.warn("Search limit not set...");
            return false;
        }
        return true;
    }

    addPaginationQueryParameters(queryData) {
        const searchQueryState = this.searchEngine.searchContext.query;
        const currentPage = searchQueryState[PAGINATION_PAGE_NUMBER];
        let pageSize = siteConfig.defaultSearchLimit

        if (isSet(queryData?.[PAGINATION_PAGE_SIZE])) {
            pageSize = queryData[PAGINATION_PAGE_SIZE];
        }

        if (!isSet(queryData?.[PAGINATION_PAGE_NUMBER])) {
            queryData[PAGINATION_PAGE_NUMBER] = 1;
        }
        if (!isSet(queryData?.[PAGINATION_OFFSET])) {
            queryData[PAGINATION_OFFSET] = 0;
        }
        // queryData[PAGINATION_PAGE_NUMBER] = currentPage;
        // queryData[PAGINATION_OFFSET] = pageSize * currentPage;
        return queryData;
    }
    async runSearch() {

        const listingsReqOp = this.listingsEngine?.listingsContext?.[LISTINGS_REQ_OP];

        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_STATUS_STARTED);
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
                        ...this.searchEngine?.searchContext?.query,
                    }
                });
                break;
            case LISTINGS_REQ_OP_ITEM_LIST:
                request = await wpResourceRequest({
                    endpoint: `${wpApiConfig.endpoints.listRequest}/${this.searchEngine?.searchContext?.query?.[ITEM_LIST_ID]}`,
                    method: 'GET',
                    query: {
                        ...this.searchEngine?.searchContext?.query,
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

            this.searchEngine.setPageControlsAction(pageControlData)


        if (completed) {
            // this.searchEngine.setHasMoreSearchPages()

            this.searchEngine.updateContext({key: 'initialRequestHasRun', value: true})
            this.searchEngine.setSearchRequestStatusAction(SEARCH_STATUS_IDLE);
            this.searchEngine.setSearchRequestOperationAction(SEARCH_REQUEST_IDLE);
        }
    }
    async savedItemsRequest() {
        return await wpResourceRequest({
            endpoint: `${wpApiConfig.endpoints.savedItemsList}`,
            method: REQUEST_POST,
            protectedRequest: true
        });
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
    getListingsProviders({api_listings_service, select_providers, providers_list}, endpoint = "providers", callback) {

    }
}
