import {ListingsEngineBase} from "@/truvoicer-base/library/listings/engine/listings-engine-base";
import {isEmpty, isNotEmpty, isObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS, LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST, LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {
    NEW_SEARCH_REQUEST, PAGE_CONTROL_CURRENT_PAGE, PAGE_CONTROL_HAS_MORE,
    PAGE_CONTROL_PAGE_SIZE, PAGE_CONTROL_PAGINATION_REQUEST, PAGE_CONTROL_REQ_PAGINATION_TYPE,
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
import PostsBlock from "@/truvoicer-base/components/blocks/posts/PostsBlock";
import React from "react";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {setPostListDataAction} from "@/truvoicer-base/redux/actions/page-actions";

export class ListingsManager extends ListingsEngineBase {

    constructor(listingsContext, searchContext) {
        super(listingsContext, searchContext);
    }
    setListingsBlocksDataAction(data) {
        if (!isObject(data) || isObjectEmpty(data)) {
            return false;
        }

        if (data !== null) {
            this.listingsEngine.updateContext({key: "listingsData", value: data})
            switch (data?.source) {
                case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                    this.setPostsBlocksDataAction(data);
                    break;
                case LISTINGS_BLOCK_SOURCE_API:
                default:
                    if (isNotEmpty(data.api_listings_category)) {
                        this.listingsEngine.updateContext({key: "category", value: data.api_listings_category})
                        this.listingsEngine.getListingsProviders(
                            data,
                            "providers",
                            (status, data) => {
                                this.getProvidersCallback(status, data)
                                }
                            )
                    }
                    break;
            }
        }
    }
    setPostsBlocksDataAction(data) {
        switch (data?.wordpress_data_source) {
            case LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST:
                this.listingsEngine.updateContext({key: "category", value: data?.listings_category})
                this.getListingsInitialLoad();
                break;
            case LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS:
                this.listingsEngine.updateContext({key: "category", value: data?.category_id})
                break;
        }
    }

    getSearchLimit() {
        const listingsDataState = this.listingsEngine.listingsContext?.listingsData;
        if (isSet(listingsDataState.search_limit) &&
            listingsDataState.search_limit !== "" &&
            listingsDataState.search_limit !== null &&
            !isNaN(listingsDataState.search_limit)) {
            return parseInt(listingsDataState.search_limit)
        }
        return fetcherApiConfig.defaultSearchLimit;

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

    initialisePageControls() {
        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_PAGE_SIZE, this.getSearchLimit())
    }

    getListingsInitialLoad() {
        const listingsDataState = this.listingsEngine?.listingsContext.listingsData;
        if (isEmpty(listingsDataState)) {
            // setSearchError("Listings data empty on initial search...")
            return false;
        }
        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                this.getWordpressInitialLoad(listingsDataState)
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                this.apiListingsInitialLoad(listingsDataState)
                break;
        }

    }
    getWordpressInitialLoad(listingsData) {
        switch (listingsData?.wordpress_data_source) {
            case LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST:
                this.postsListingsInitialLoad(listingsData)
                break;
            case LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS:
                this.postsInitialLoad(listingsData)
                break;
        }

    }

    postsListingsInitialLoad(listingsDataState) {
        if (!Array.isArray(listingsDataState?.item_list_id)) {
            return;
        }
        let listData = extractItemListFromPost({post: listingsDataState?.item_list_id});
        if (!listData) {
            console.error('Invalid item list post data...')
            listData = [];
        }
        this.searchEngine.setSearchRequestOperationAction(NEW_SEARCH_REQUEST);
        const category = listingsDataState.listings_category;
        this.getUserItemsListAction(listData, siteConfig.internalProviderName, category)
        this.searchEngine.setSearchListDataAction(listData);
        this.searchEngine.setSearchCategoryAction(category)
        this.searchEngine.setSearchProviderAction(siteConfig.internalProviderName)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
        // setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
        // setSearchRequestServiceAction(data.request_service)
        // setPageControlsAction(data.extra_data)
    }
    postsInitialLoad(listingsDataState) {
        if (!Array.isArray(listingsDataState?.item_list_id)) {
            return;
        }
        let listData = extractItemListFromPost({post: listingsDataState?.item_list_id});
        if (!listData) {
            console.error('Invalid item list post data...')
            listData = [];
        }
        this.searchEngine.setSearchRequestOperationAction(NEW_SEARCH_REQUEST);
        const category = listingsDataState.category_id;
        // this.getUserItemsListAction(listData, siteConfig.internalProviderName, category)
        this.searchEngine.setSearchListDataAction(listData);
        this.searchEngine.setSearchCategoryAction(category)
        // this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
    }

    apiListingsInitialLoad(listingsDataState) {
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
        const listingsQueryData = this.listingsEngine?.listingsContext?.listingsQueryData;
        if (!isSet(listingsDataState.listings_category)) {
            console.log("No category found...")
            // this.setSearchRequestErrorAction("No category found...")
            return false;
        }
        if (!isSet(listingsQueryData[fetcherApiConfig.searchLimitKey])) {
            this.listingsEngine.addListingsQueryDataString(fetcherApiConfig.searchLimitKey, fetcherApiConfig.defaultSearchLimit);
        }
        return true;
    }

    loadNextPageNumberMiddleware(pageNumber) {
        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_PAGINATION_REQUEST, true)
        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, parseInt(pageNumber))
    }

    runSearch() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;

        switch (listingsDataState?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                switch (listingsDataState?.wordpress_data_source) {
                    case LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST:
                        this.runFetcherApiListingsSearch()
                        break;
                    case LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS:
                        this.runFetcherApiListingsSearch()
                        break;
                    default:
                        console.warn('Invalid wordpress data source...')
                        break
                }
                break;
            case LISTINGS_BLOCK_SOURCE_API:
                this.runFetcherApiListingsSearch()
                break;
            default:
                console.warn('Invalid listings source...')
                break;
        }
    }
    runFetcherApiListingsSearch() {
        const listingsDataState =  this.listingsEngine?.listingsContext?.listingsData;
        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
        const pageControlsState = this.searchEngine.searchContext.pageControls;
        const validate = this.validateSearchParams();
        if (!validate) {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            return false;
        }

        if (!pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            this.searchEngine.setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, 1);
        }
        // const providers = this.getSearchProviders();
        // const filterProviders = this.searchEngine.filterSearchProviders(providers);
        // filterProviders.map((provider, index) => {
        //     fetchData(
        //         "operation",
        //         [this.searchEngine.getEndpointOperation()],
        //         this.searchEngine.buildQueryData(filterProviders, provider, this.listingsEngine?.listingsContext?.listingsQueryData),
        //         this.searchResponseHandler.bind(this),
        //         (filterProviders.length === index + 1)
        //     )
        // })
        wpResourceRequest({
            endpoint: wpApiConfig.endpoints.postListRequest,
            method: 'POST',
            data: {
                posts_per_page: listingsDataState?.posts_per_page,
                show_all_categories: listingsDataState?.show_all_categories,
                categories: listingsDataState?.categories,
                page_number: isNotEmpty(pageNumber) ? parseInt(pageNumber) : 1
            }
        })
            .then(response => {
                console.log({response})
                if (!isCancelled) {
                    if (response?.data?.status === "success" && Array.isArray(response.data?.postList)) {
                        setPosts(response.data.postList);
                        setPostListDataAction(response.data.postList);
                        setPaginationControls(response.data.pagination)
                    } else {
                        console.log("Post list error")
                    }
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    runFetcherApiListingsSearch() {
        this.searchEngine.setPageControlItemAction(PAGE_CONTROL_HAS_MORE, false)
        this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_STARTED);
        const pageControlsState = this.searchEngine.searchContext.pageControls;
        const validate = this.validateSearchParams();
        if (!validate) {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            return false;
        }

        if (!pageControlsState[PAGE_CONTROL_PAGINATION_REQUEST]) {
            this.searchEngine.setPageControlItemAction(PAGE_CONTROL_CURRENT_PAGE, 1);
        }
        const providers = this.getSearchProviders();
        const filterProviders = this.searchEngine.filterSearchProviders(providers);
        filterProviders.map((provider, index) => {
            fetchData(
                "operation",
                [this.searchEngine.getEndpointOperation()],
                this.searchEngine.buildQueryData(filterProviders, provider, this.listingsEngine?.listingsContext?.listingsQueryData),
                this.searchResponseHandler.bind(this),
                (filterProviders.length === index + 1)
            )
        })
    }

    searchResponseHandler(status, data, completed = false) {
        if (status === 200 && data.status === "success") {
            this.getUserItemsListAction(data.request_data, data.provider, data.category)
            this.searchEngine.setSearchListDataAction(data.request_data);
            this.searchEngine.setSearchExtraDataAction(data.extra_data, data.provider, data.request_data)
            this.searchEngine.setSearchRequestServiceAction(data.request_service)
            this.searchEngine.setSearchProviderAction(data.provider)
            this.searchEngine.setSearchCategoryAction(data.category)
            let pageControlData = {
                [PAGE_CONTROL_REQ_PAGINATION_TYPE]: null
            };
            if (isNotEmpty(data?.extra_data) && isObject(data.extra_data)) {
                pageControlData = {...pageControlData, ...data.extra_data};
            }
            if (isNotEmpty(data?.[PAGE_CONTROL_REQ_PAGINATION_TYPE])) {
                pageControlData[PAGE_CONTROL_REQ_PAGINATION_TYPE] = data[PAGE_CONTROL_REQ_PAGINATION_TYPE];
            }
            this.searchEngine.setPageControlsAction(pageControlData)

        } else {
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_ERROR);
            this.searchEngine.setSearchRequestErrorAction(data.message)
        }
        if (completed) {
            // this.searchEngine.setHasMoreSearchPages()
            this.searchEngine.setSearchRequestStatusAction(SEARCH_REQUEST_COMPLETED);
            this.searchEngine.setSearchRequestOperationAction(null);
        }
    }

    getUserItemsListAction(data, provider, category) {
        if (data.length === 0) {
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
            return item.item_id;
        })
        const wpListIds = this.listingsEngine.getCustomItemsData(listPositions).map((item) =>  {
            return item.item_id;
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
    getSearchProviders() {
        const queryDataState = this.listingsEngine?.listingsContext?.listingsQueryData;
        const listingsDataState = this.listingsEngine?.listingsContext?.listingsData;
        let providers = [];
        if (!Array.isArray(queryDataState?.providers) || queryDataState.providers.length === 0) {
            if (Array.isArray(listingsDataState?.providers) && listingsDataState.providers.length) {
                providers = listingsDataState.providers.map(provider => {
                    return provider.provider_name;
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
}
