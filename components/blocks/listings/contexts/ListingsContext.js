import React from 'react'
import {isSet} from "@/truvoicer-base/library/utils";
import {siteConfig} from "@/config/site-config";
import {LISTINGS_GRID_COMPACT} from "@/truvoicer-base/redux/constants/listings-constants";

export const listingsData = {
    category: "",
    listingsGrid: isSet(siteConfig.defaultGridSize)? siteConfig.defaultGridSize : LISTINGS_GRID_COMPACT,
    listingsData: {},
    listingsQueryData: {},
    listingsSearchResults: {},
    listingsRequestStatus: "",
    listingsScrollTop: false,
    error: {},
    updateData: () => {}
};

export const ListingsContext = React.createContext(listingsData);
