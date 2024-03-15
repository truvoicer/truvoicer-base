import React from 'react'
import {isSet} from "@/truvoicer-base/library/utils";
import {siteConfig} from "@/config/site-config";
import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_REQ_OP,
    LISTINGS_REQ_OP_ITEM_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";

export const listingsData = {
    category: "",
    listingsGrid: isSet(siteConfig.defaultGridSize)? siteConfig.defaultGridSize : LISTINGS_GRID_COMPACT,
    listingsData: {},
    listingsQueryData: {},
    listingsSearchResults: {},
    listingsRequestStatus: "",
    [LISTINGS_REQ_OP]: null,
    listingsScrollTop: false,
    error: {},
    updateData: () => {},
    updateNestedObjectData: () => {}
};

export const ListingsContext = React.createContext(listingsData);
