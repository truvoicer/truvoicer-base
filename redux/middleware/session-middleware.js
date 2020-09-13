import {isObjectEmpty} from "../../library/utils";
import {
    getSavedItemsListByUserAction,
    setSessionErrorAction,
    setSessionLocalStorage,
    setSessionUserAction
} from "../actions/session-actions";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";

const axios = require('axios');

export function getSessionTokenMiddleware(url, requestData, callback = false, headers = {}) {
    return function(dispatch) {
        let data = {
            method: "post",
            url: url,
            data: requestData
        }
        if (!isObjectEmpty(headers)) {
            data.headers = headers
        }
        return axios.request(data)
            .then(response => {
                if (response.data.success) {
                    setSessionUserAction(response.data.data, true)
                    setSessionLocalStorage(response.data.data.token)
                    callback(false, response.data);
                    // resetSessionErrorAction()
                } else {
                    // setSessionErrorAction(response.data)
                    callback(true, response.data);
                }
            })
            .catch(error => {
                setSessionErrorAction(error)
                callback(true, error);
            });
    };
}

export function createUserMiddleware(requestData, callback) {
    return function(dispatch) {
        return axios.post(buildWpApiUrl(wpApiConfig.endpoints.createUser), requestData)
            .then(response => {
                callback(false, response.data);
            })
            .catch(error => {
                console.error(error)
                callback(true, error?.response);
            });
    }
}

export function updateUserMiddleware(requestData, callback) {
    return function(dispatch) {
        return axios.post(buildWpApiUrl(wpApiConfig.endpoints.updateUser), requestData)
            .then(response => {
                callback(false, response.data);
            })
            .catch(error => {
                console.error(error)
                callback(true, error);
            });
    }
}

export function updateUserSessionData(data) {
    return function(dispatch) {
        setSessionUserAction(data, true)
    }
}


export function getSavedItemsListByUserMiddleware(requestData, callback) {
    return function(dispatch) {
        getSavedItemsListByUserAction(requestData, callback)
    }
}