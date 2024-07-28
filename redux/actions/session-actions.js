import store from "../store"
import React from "react";
import {
    setAuthenticated, setIsAuthenticating,
    setPasswordResetKey,
    setSessionError,
    setUser, setUserId
} from "../reducers/session-reducer";
import {produce} from "immer";
import {
    SESSION_AUTH_PROVIDER, SESSION_AUTH_PROVIDER_USER_ID,
    SESSION_USER_DISPLAY_NAME,
    SESSION_USER_EMAIL,
    SESSION_USER_FIRSTNAME,
    SESSION_USER_ID,
    SESSION_USER_LASTNAME,
    SESSION_USER_NICE_NAME, SESSION_USER_NICK_NAME,
    SESSION_USER_TOKEN
} from "../constants/session-constants";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {isSet} from "../../library/utils";
import {wpApiConfig} from "../../config/wp-api-config";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

export function setSessionUserAction(data, authenticated) {
    let sessionUserState = {...store.getState().session.user};
    const nextState = produce(sessionUserState, (draftState) => {
        draftState[SESSION_AUTH_PROVIDER] = data?.auth_provider;
        draftState[SESSION_AUTH_PROVIDER_USER_ID] = data?.auth_provider_user_id;
        draftState[SESSION_USER_TOKEN] = data?.token;
        draftState[SESSION_USER_ID] = data?.id;
        draftState[SESSION_USER_EMAIL] = data?.user_email;
        draftState[SESSION_USER_DISPLAY_NAME] = data?.display_name;
        draftState[SESSION_USER_NICE_NAME] = data?.user_nicename;
        draftState[SESSION_USER_FIRSTNAME] = data?.first_name;
        draftState[SESSION_USER_LASTNAME] = data?.last_name;
        draftState[SESSION_USER_NICK_NAME] = data?.nickname;
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

export async function validateToken() {
    if (!getSessionObject()) {
        setIsAuthenticatingAction(false)
        return false;
    }
    try {
        const response = await wpResourceRequest({
            endpoint: wpApiConfig.endpoints.validateToken,
            method: 'GET',
            protectedReq: true
        })
        const responseData = await response.json();
        if (responseData?.status === 'success') {
            setSessionUserAction(responseData.data, true)
        } else {
            // removeLocalSession()
        }
        setIsAuthenticatingAction(false)
    } catch (error) {
        setSessionErrorAction(error)
        setIsAuthenticatingAction(false)
    }
}

export function logout() {
    const data = {};
    data[SESSION_AUTH_PROVIDER] = "";
    data[SESSION_AUTH_PROVIDER_USER_ID] = "";
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

export function setSessionLocalStorage(token, expiresAt) {
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
        const expiry = JSON.parse(expiresAt);
        return {
            token: localStorage.getItem('token'),
            expires_at: expiry
        }
    } catch (error) {
        console.error(error);
        logout();
        return false;
    }
}

export function setSessionUserIdAction(userId) {
    store.dispatch(setUserId(userId));
}

export function setPasswordResetKeyAction(passwordResetKey) {
    store.dispatch(setPasswordResetKey(passwordResetKey));
}

export function setIsAuthenticatingAction(isAuthenticating) {
    store.dispatch(setIsAuthenticating(isAuthenticating));
}
