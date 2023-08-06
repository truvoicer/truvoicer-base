import React from 'react'
import {isSet} from "@/truvoicer-base/library/utils";
import {siteConfig} from "@/config/site-config";
import {LISTINGS_GRID_COMPACT} from "@/truvoicer-base/redux/constants/listings-constants";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_IDLE} from "@/truvoicer-base/redux/constants/search-constants";

export const searchData = {
    searchStatus: SEARCH_REQUEST_IDLE,
    searchOperation: NEW_SEARCH_REQUEST,
    extraData: {},
    searchList: [],
    savedItemsList: [],
    itemRatingsList: [],
    pageControls: {
        paginationRequest: false,
        hasMore: false,
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 0
    },
    requestService: "",
    provider: "",
    category: "",
    error: {},
    updateData: () => {}
};

export const SearchContext = React.createContext(searchData);
