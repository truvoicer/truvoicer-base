import store from "../store"
import React from "react";
import {
    setItemCategory, setItemData,
    setItemError, setItemId,
    setItemProvider,
} from "../reducers/item-reducer";
import {fetchData} from "../../library/api/fetcher/middleware";
import produce from "immer";

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