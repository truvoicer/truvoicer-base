import store from "../store"
import React from "react";
import {
    setItemCategory, setItemData,
    setItemError, setItemId,
    setItemProvider,
} from "../reducers/item-reducer";
import {fetchData} from "../../library/api/fetcher/middleware";
import produce from "immer";
import {listingsGridConfig} from "../../../config/listings-grid-config";
import {isSet} from "../../library/utils";
import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_CUSTOM,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "../constants/listings-constants";

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

export function getItemAction(requestData) {
    fetchData("operation", ["single"], requestData, fetchItemCallback)
}

export function fetchLoaderDataAction(operation, requestData, callback) {
    fetchData("operation", [operation], requestData, callback)
}

export function fetchItemCallback (status, data) {
    const itemDataState = {...store.getState().item.data};
    if (status === 200) {
        const object = Object.assign({}, itemDataState, data.request_data[0]);
        store.dispatch(setItemData(object))
    } else {
        console.error(data)
        store.dispatch(setItemError("Item fetch error..."))
    }
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