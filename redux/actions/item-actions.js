import store from "../store"
import React from "react";
import {
    setItemCategory,
    setItemData, setItemDisplayAs,
    setItemError,
    setItemId,
    setItemProvider,
    setItemType,
} from "../reducers/item-reducer";
import {FetcherApiMiddleware} from "../../library/api/fetcher/middleware";
import {listingsGridConfig} from "@/truvoicer-base/config/listings-grid-config";
import {isNotEmpty, isSet} from "../../library/utils";
import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_CUSTOM,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "../constants/listings-constants";
import {ItemRoutes} from "@/config/item-routes";
import {getSiteSettings} from "@/truvoicer-base/library/api/wp/middleware";

const sprintf = require('sprintf-js').sprintf;
const fetcherApiMiddleware = new FetcherApiMiddleware();

export function setItemErrorAction(error) {
    store.dispatch(setItemError(error))
}
export function setItemCategoryAction(category) {
    store.dispatch(setItemCategory(category))
}
export function setItemProviderAction(provider) {
    store.dispatch(setItemProvider(provider))
}
export function setItemIdAction(itemId) {
    store.dispatch(setItemId(itemId))
}
export function setItemTypeAction(itemType) {
    store.dispatch(setItemType(itemType))
}
export function setItemDisplayAsAction(displayAs) {
    store.dispatch(setItemDisplayAs(displayAs))
}

export function setItemDataAction(itemData) {
    const itemDataState = {...store.getState().item.data};
    const object = Object.assign({}, itemDataState, itemData);
    store.dispatch(setItemData(object))
}

export async function getItemAction(requestData) {
    return await fetcherApiMiddleware.fetchData("operation", ["single"], requestData)
}

export async function fetchLoaderDataAction(operation, requestData, callback) {
    const response = await fetcherApiMiddleware.fetchData("operation", [operation], requestData);
    callback(response.status, response.data)
}

export function setSingleItemPostState({databaseId, dataKeys = null}) {
    if (!isNotEmpty(dataKeys)) {
        console.error("Single Item data keys is either empty or undefined.")
        return;
    }

    // const parseJson = JSON.parse(dataKeys)
    // if (!Array.isArray(parseJson?.api_data_keys_list)) {
    //     console.error("Single item (api_data_keys_list) is not a valid array.")
    //     return;
    // }

    // let dataKeyObject = buildDataKeyObject(parseJson.api_data_keys_list, databaseId);
    setItemIdAction(databaseId)
    setItemDataAction(dataKeys)
}

export const getCustomItem = (item, category) => {
    const gridConfig = listingsGridConfig.gridItems;
    if (!isSet(gridConfig[category])) {
        return null;
    }
    if (!isSet(gridConfig[category][LISTINGS_GRID_CUSTOM])) {
        return null;
    }
    const CustomItem = gridConfig[category][LISTINGS_GRID_CUSTOM];
    return <CustomItem data={item} />
}


export const getGridItemColumns = (listingsGrid) => {
    switch (listingsGrid) {
        case LISTINGS_GRID_COMPACT:
            return {
                sm: 12,
                md: 6,
                lg: 4
            };
        case LISTINGS_GRID_LIST:
            return {
                sm: 12,
                md: 12,
                lg: 12
            };
        case LISTINGS_GRID_DETAILED:
            return {
                sm: 12,
                md: 6,
                lg: 6
            };
        default:
            return {
                sm: 12,
                md: 6,
                lg: 4
            };
    }
}

export function getItemViewUrl(item, category) {
    let data = {
        item_id: item.item_id
    }
    if (item?.custom_item) {
        return sprintf(ItemRoutes.internalItemView, data);
    } else if (isNotEmpty(item?.provider)) {
        data.category = category
        data.provider = item.provider
        return sprintf(ItemRoutes.externalItemView, data);
    } else {
        return null;
    }
}

