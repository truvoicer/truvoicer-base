import React from "react";
import {
    setPageDataAction,
    getUserAccountMenuAction, setModalContentAction, setSiteSettingsAction,
} from "../actions/page-actions";
import {setShowModal} from "../reducers/page-reducer";

export function getPageDataMiddleware(data) {
    return function(dispatch) {
        return setPageDataAction(data);
    }
}

export function setSiteSettingsMiddleware(data) {
    return function(dispatch) {
        return setSiteSettingsAction(data);
    }
}

export function setUserAccountMenuMiddleware() {
    return function(dispatch) {
        return getUserAccountMenuAction();
    }
}

export function showPageModalMiddleware(show) {
    return function (dispatch) {
        dispatch(setShowModal(show))
    }
}

export function setModalContentMiddleware(component, data, show) {
    return function (dispatch) {
        setModalContentAction(component, data, show);
    }
}

