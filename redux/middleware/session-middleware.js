import {
    getSavedItemsListByUserAction, setIsAuthenticatingAction,
    setSessionErrorAction,
    setSessionLocalStorage,
    setSessionUserAction
} from "../actions/session-actions";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const axios = require('axios');

export function getSessionTokenMiddleware(url, requestData, callback = () => {}, headers = {}) {
    return wpResourceRequest({
        endpoint: url,
        method: 'POST',
        data: requestData
    })
        .then(response => {
            console.log('getSessionTokenMiddleware', {response})
            switch (response.status) {
                case 200:
                    setSessionLocalStorage(response.data.data.token, response.data.expiresAt)
                    setSessionUserAction(response.data.data, true)
                    setIsAuthenticatingAction(false)
                    callback(false, response.data);
                    break;
                default:
                    setSessionErrorAction(response.data)
                    setIsAuthenticatingAction(false)
                    callback(true, response.data);
                    break;
            }
        })
        .catch(error => {
            setSessionErrorAction(error)
            setIsAuthenticatingAction(false)
            if (typeof callback === 'function') {
                callback(true, error);
            }
        });
}

export function createUserMiddleware(requestData, callback) {
    return wpResourceRequest({
        endpoint: wpApiConfig.endpoints.createUser,
        method: 'POST',
        data: requestData
    })
        .then(response => {
            callback(false, response.data);
        })
        .catch(error => {
            console.error(error)
            callback(true, error?.response?.data);
        });
}

export function updateUserMiddleware(requestData, callback) {
    return axios.post(buildWpApiUrl(wpApiConfig.endpoints.updateUser), requestData)
        .then(response => {
            callback(false, response.data);
        })
        .catch(error => {
            console.error(error)
            callback(true, error);
        });

}

export function updateUserSessionData(data) {
    setSessionUserAction(data, true)

}


export function getSavedItemsListByUserMiddleware(requestData, callback) {
    getSavedItemsListByUserAction(requestData, callback)
}
