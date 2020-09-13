import store from "../store"
import React from "react";
import {setAuthenticated, setSavedItems, setSessionError, setUser} from "../reducers/session-reducer";
import produce from "immer";
import {
    SESSION_AUTH_TYPE,
    SESSION_USER_DISPLAY_NAME,
    SESSION_USER_EMAIL,
    SESSION_USER_FIRSTNAME,
    SESSION_USER_ID,
    SESSION_USER_LASTNAME,
    SESSION_USER_NICE_NAME, SESSION_USER_NICK_NAME,
    SESSION_USER_TOKEN
} from "../constants/session-constants";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {isSet, uCaseFirst} from "../../library/utils";
import {wpApiConfig} from "../../config/wp-api-config";

const axios = require("axios")

export function setSessionUserAction(data, authenticated) {
    let sessionUserState = {...store.getState().session.user};
    const nextState = produce(sessionUserState, (draftState) => {
        draftState[SESSION_AUTH_TYPE] = data.auth_type;
        draftState[SESSION_USER_TOKEN] = data.token;
        draftState[SESSION_USER_ID] = data.id;
        draftState[SESSION_USER_EMAIL] = data.user_email;
        draftState[SESSION_USER_DISPLAY_NAME] = data.display_name;
        draftState[SESSION_USER_NICE_NAME] = data.user_nicename;
        draftState[SESSION_USER_FIRSTNAME] = data.first_name;
        draftState[SESSION_USER_LASTNAME] = data.last_name;
        draftState[SESSION_USER_NICK_NAME] = data.nickname;
    })
    store.dispatch(setUser(nextState))
    store.dispatch(setAuthenticated(authenticated))
}

export function resetSessionErrorAction() {
    let sessionErrorState = {...store.getState().session.error};
    const nextState = produce(sessionErrorState, (draftState) => {
        draftState.show = false;
        draftState.message = "";
        draftState.data = {};
    });
    store.dispatch(setSessionError(nextState))
}

export function setSessionErrorAction(error) {
    let sessionErrorState = {...store.getState().session.error};
    const nextState = produce(sessionErrorState, (draftState) => {
        draftState.show = true;
        if (isSet(error.response) && isSet(error.response.data) && isSet(error.response.data.message)) {
            draftState.message = error.response.data.message;
        } else {
            draftState.message = "Session Error";
        }
    });
    store.dispatch(setSessionError(nextState))
}

export function getSessionUserAction() {
    return {...store.getState().session.user};
}

export function getSessionAction() {
    return {...store.getState().session};
}

export function validateToken() {
    if (!getSessionObject()) {
        return false;
    }
    console.log(getSessionObject())
    // if (new Date().getTime() > getSessionObject().expires_at) {
    //     removeLocalSession()
    //     return false;
    // }
    let config = {
        url: buildWpApiUrl(wpApiConfig.endpoints.validateToken),
        method: "post",
        headers: {'Authorization': 'Bearer ' + getSessionObject().token}
    }
    axios.request(config)
        .then((response) => {
            // console.log(response.data)
            if (response.data.success) {
                setSessionUserAction(response.data.data, true)
            } else {
                removeLocalSession()
            }
        })
        .catch((error) => {
            setSessionErrorAction(error)
        })
}

export function logout() {
    const data = {};
    data[SESSION_AUTH_TYPE] = "";
    data[SESSION_USER_ID] = null;
    data[SESSION_USER_EMAIL] = "";
    data[SESSION_USER_NICE_NAME] = "";
    data[SESSION_USER_FIRSTNAME] = "";
    data[SESSION_USER_LASTNAME] = "";
    data[SESSION_USER_DISPLAY_NAME] = "";
    data[SESSION_USER_TOKEN] = "";
    setSessionUserAction(data, false);
    removeLocalSession();
}

export function setSessionLocalStorage(token) {
    let expiresAt = JSON.stringify(new Date(new Date().getTime() + 60 * 60 * 24 * 1000));
    // console.log(expiresAt)
    localStorage.setItem('token', token);
    localStorage.setItem('expires_at', expiresAt);
}


// removes user details from localStorage
export const removeLocalSession = () => {
    // Clear access token and ID token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
}

export const getSessionObject = () => {
    if (typeof localStorage === 'undefined') {
        return false;
    }
    try {
        let expiresAt = localStorage.getItem('expires_at');
        let token = localStorage.getItem('token');
        if (!isSet(expiresAt) || expiresAt === null || expiresAt === "" ||
            !isSet(token) || token === null || token === "") {
            return false;
        }
        return {
            token: localStorage.getItem('token'),
            expires_at: JSON.parse(expiresAt)
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export function getSavedItemsListByUserAction(requestData, callback = false) {
    const sendRequest = axios.post(buildWpApiUrl(wpApiConfig.endpoints.savedItemsListByUser), requestData);
    if (!callback) {
        return sendRequest
    } else {
        sendRequest.then(response => {
            callback(false, response.data);
        })
            .catch(error => {
                console.error(error)
                callback(true, error)
            });
    }
}