import store from "../store";
import {SESSION_AUTHENTICATED, SESSION_USER, SESSION_USER_ID} from "../constants/session-constants";
import {setModalContentAction} from "./page-actions";
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import produce from "immer";
import {APPEND_SEARCH_REQUEST, NEW_SEARCH_REQUEST} from "../constants/search-constants";
import {setItemRatingsList, setSavedItemsList} from "../reducers/search-reducer";
import {isSet} from "../../library/utils";
import {componentsConfig} from "../../../config/components-config";
import {wpApiConfig} from "../../config/wp-api-config";

const axios = require('axios');
const sprintf = require("sprintf").sprintf;

export function getUserItemsListAction(data, provider, category) {
    if (data.length === 0) {
        return false;
    }
    const userId = store.getState().session[SESSION_USER][SESSION_USER_ID]
    const itemsList = data.map((item) => {
        return item.item_id;
    })
    const requestData = {
        provider_name: provider,
        category: category,
        id_list: itemsList,
        user_id: userId
    }
    protectedApiRequest(
        buildWpApiUrl(wpApiConfig.endpoints.savedItemsList),
        requestData,
        getUserItemsListCallback
    )
}

export function getUserItemsListCallback(error, data) {
    // console.log(error, data)
    if (error) {
        return false;
    }
    const searchState = {...store.getState().search};
    setSavedItemsListAction(data.data.saved_items, searchState);
    setItemRatingsListAction(data.data.item_ratings, searchState);
}

export function setSavedItemsListAction(data, searchState) {
    const searchOperation = searchState.searchOperation;
    const nextState = produce(searchState.savedItemsList, (draftState) => {
        if ((searchOperation === NEW_SEARCH_REQUEST)) {
            draftState.splice(0, draftState.length + 1);
        }
        data.map((item) => {
            draftState.push(item)
        })
    })
    store.dispatch(setSavedItemsList(nextState))
}

export function setItemRatingsListAction(data, searchState) {
    const searchOperation = searchState.searchOperation;
    const nextState = produce(searchState.itemRatingsList, (draftState) => {
        if ((searchOperation === NEW_SEARCH_REQUEST)) {
            draftState.splice(0, draftState.length + 1);
        }
        data.map((item) => {
            draftState.push(item)
        })
    })
    store.dispatch(setItemRatingsList(nextState))
}

export function isSavedItemAction(item_id, provider, category, user_id) {
    const savedItemsList = [...store.getState().search.savedItemsList];
    const isSaved = savedItemsList.filter(savedItem => {
        if(
            parseInt(savedItem.user_id) === parseInt(user_id) &&
            parseInt(savedItem.item_id) === parseInt(item_id) &&
            savedItem.provider_name === provider &&
            savedItem.category === category
        ) {
            return savedItem;
        }
    });
    return isSaved.length > 0;
}

export function getItemRatingDataAction(item_id, provider, category, user_id) {
    const itemRatingsList = [...store.getState().search.itemRatingsList];
    const itemRatingData = itemRatingsList.filter(item => {
        if(
            item !== null &&
            parseInt(item.user_id) === parseInt(user_id) &&
            parseInt(item.item_id) === parseInt(item_id) &&
            item.provider_name === provider &&
            item.category === category
        ) {
            return item;
        }
    });
    if (itemRatingData.length > 0) {
        return itemRatingData[0];
    }
    return false;
}

export function showAuthModal() {
    const authenticated = store.getState().session[SESSION_AUTHENTICATED];
    if (!authenticated) {
        setModalContentAction(
            componentsConfig.components.authentication_login.name,
            {},
            true
        );
        return false;
    }
    return true;
}


export function saveItemAction(provider, category, itemId, user_id) {
    if (!showAuthModal()) {
        return false;
    }
    const data = {
        provider_name: provider,
        category: category,
        item_id: itemId,
        user_id: user_id
    }
    protectedApiRequest(
        buildWpApiUrl(wpApiConfig.endpoints.saveItem),
        data,
        saveItemRequestCallback
    )
    updateSavedItemAction(data)
}

export function updateSavedItemAction(data) {
    const searchState = {...store.getState().search};
    const nextState = produce(searchState.savedItemsList, (draftState) => {
        if (isSavedItemAction(data.item_id, data.provider_name, data.category, data.user_id)) {
            draftState.splice(getSavedItemIndexAction(data.item_id, data.provider_name, data.category, data.user_id), 1);
        } else {
            draftState.push(data)
        }
    })
    store.dispatch(setSavedItemsList(nextState))
}

export function getSavedItemIndexAction(item_id, provider, category, user_id) {
    let index;
    const savedItemsList = [...store.getState().search.savedItemsList];
    savedItemsList.map((savedItem, savedItemIndex) => {
        if(
            parseInt(savedItem.user_id) === parseInt(user_id) &&
            savedItem.item_id === item_id &&
            savedItem.provider_name === provider &&
            savedItem.category === category
        ) {
            index = savedItemIndex;
        }
    });
    return index;
}

export function saveItemRatingAction(provider, category, itemId, user_id, rating) {
    if (!showAuthModal()) {
        return false;
    }
    const data = {
        provider_name: provider,
        category: category,
        item_id: itemId,
        user_id: user_id,
        rating: rating,
    }
    protectedApiRequest(
        buildWpApiUrl(wpApiConfig.endpoints.saveItemRating),
        data,
        updateItemRatingAction
    )
    updateItemRatingAction(data)
}

export function updateItemRatingAction(status, data) {
    if (!isSet(data) || !isSet(data.data) ) {
        return;
    }
    if (Array.isArray(data.data) && data.data.length > 0) {
        const itemData = data.data[0];
        const searchState = {...store.getState().search};
        const nextState = produce(searchState.itemRatingsList, (draftState) => {
            if (getItemRatingDataAction(itemData.item_id, itemData.provider_name, itemData.category, itemData.user_id)) {
                const getIndex = getItemRatingIndexAction(itemData.item_id, itemData.provider_name, itemData.category, itemData.user_id);
                draftState.splice(getIndex, 1);
            }
            draftState.push(itemData)
        })
        store.dispatch(setItemRatingsList(nextState))
    }
}

export function getItemRatingIndexAction(item_id, provider, category, user_id) {
    let index;
    const itemRatingsList = [...store.getState().search.itemRatingsList];
    itemRatingsList.map((item, itemIndex) => {
        if(
            parseInt(item.user_id) === parseInt(user_id) &&
            item.item_id === item_id &&
            item.provider_name === provider &&
            item.category === category
        ) {
            index = itemIndex;
        }
    });
    return index;
}

export function saveItemRequestCallback(error, data) {
    console.log(error, data)
}