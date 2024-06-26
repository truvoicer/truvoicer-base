import React from 'react'
import {isSet} from "@/truvoicer-base/library/utils";
import {siteConfig} from "@/config/site-config";
import {LISTINGS_GRID_COMPACT} from "@/truvoicer-base/redux/constants/listings-constants";
import {
    NEW_SEARCH_REQUEST,
    PAGINATION_PAGE_NUMBER, PAGINATION_PAGE_SIZE,
    SEARCH_REQUEST_IDLE
} from "@/truvoicer-base/redux/constants/search-constants";

export const searchData = {
    searchStatus: SEARCH_REQUEST_IDLE,
    searchOperation: NEW_SEARCH_REQUEST,
    searchEntity: null,
    initialRequestHasRun: false,
    extraData: {},
    searchList: [],
    savedItemsList: [],
    itemRatingsList: [],
    labels: {},
    query: {
        [PAGINATION_PAGE_NUMBER]: 1,
        [PAGINATION_PAGE_SIZE]: null,
        provider: null,
    },
    pageControls: {
        initialized: false,
        paginationRequest: false,
        hasMore: false,
        total_items: 0,
        total_pages: 0,
        current_page: 1,
        page_size: 0
    },
    requestService: "",
    provider: "",
    category: "",
    error: {},
    updateData: () => {}
};

export const SearchContext = React.createContext(searchData);
