import store from "../store"
import React from "react";
import {setItemCategory, setItemData, setItemError, setItemId, setItemProvider,} from "../reducers/item-reducer";
import {fetchData} from "../../library/api/fetcher/middleware";
import {listingsGridConfig} from "../../../config/listings-grid-config";
import {isNotEmpty, isSet} from "../../library/utils";
import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_CUSTOM,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "../constants/listings-constants";
import {ItemRoutes} from "../../../config/item-routes";
import {buildDataKeyObject} from "../../library/helpers/items";

const sprintf = require("sprintf").sprintf;

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
export function setItemDataAction(itemData) {
    const itemDataState = {...store.getState().item.data};
    const object = Object.assign({}, itemDataState, itemData);
    store.dispatch(setItemData(object))
}

export function getItemAction(requestData) {
    console.log(requestData)
    fetchData("operation", ["single"], requestData, fetchItemCallback)
}

export function fetchLoaderDataAction(operation, requestData, callback) {
    fetchData("operation", [operation], requestData, callback)
}

export function fetchItemCallback (status, data) {
    if (status === 200) {
        setItemDataAction(data.request_data[0])
    } else {
        console.error(data)
        store.dispatch(setItemError("Item fetch error..."))
    }
}

export function setSingleItemPostState(itemData) {
    const dataKeysJson = itemData?.fetcherSingleItem?.single_item_data_keys;
    if (!isNotEmpty(dataKeysJson)) {
        console.error("Single Item data keys is either empty or undefined.")
        return;
    }

    const parseJson = JSON.parse(dataKeysJson)
    if (!Array.isArray(parseJson?.api_data_keys_list)) {
        console.error("Single item (api_data_keys_list) is not a valid array.")
        return;
    }

    let dataKeyObject = buildDataKeyObject(parseJson.api_data_keys_list);
    dataKeyObject.item_id = itemData.fetcherSingleItem.databaseId;

    setItemIdAction(itemData.fetcherSingleItem.databaseId)
    setItemProviderAction("Internal")
    setItemCategoryAction("recruitment")
    setItemDataAction(dataKeyObject)
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

