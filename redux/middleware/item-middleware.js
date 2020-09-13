import React from "react";
import {getItemAction, setItemCategoryAction, setItemIdAction, setItemProviderAction} from "../actions/item-actions";

export function getItemMiddleware(requestData) {
    return function(dispatch) {
        return getItemAction(requestData);
    }
}
export function setItemProviderMiddleware(provider) {
    return function(dispatch) {
        return setItemProviderAction(provider);
    }
}
export function setItemCategoryMiddleWare(category) {
    return function(dispatch) {
        return setItemCategoryAction(category);
    }
}
export function setItemIdMiddleWare(itemId) {
    return function(dispatch) {
        return setItemIdAction(itemId);
    }
}


