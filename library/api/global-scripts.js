import TagManager from "react-gtm-module";
import store from "../../redux/store";
import {isNotEmpty} from "../utils";

const axios = require('axios');

export const AddAxiosInterceptors = () => {
    axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // if (error.status === 401 && )
        // console.log(error.response)
        return Promise.reject(error);
    });
}

export const LoadEnvironment = () => {
    const env = process.env.NEXT_PUBLIC_APP_ENV;
    if (env === "prod") {
        console.log = function () {};
    }
}

export const getTagManagerId = () => {
    const siteSettingsState = {...store.getState().page.siteSettings};

    if (!isNotEmpty(siteSettingsState?.google_tag_manager_id)) {
        console.warn("Tag Manager Id not set.")
        return false;
    }
    return siteSettingsState?.google_tag_manager_id || false;
}

export const tagManagerSendDataLayer = ({dataLayer = {}, dataLayerName}) => {
    const tagManagerId = getTagManagerId();
    if (!tagManagerId) {
        return false;
    }
    const tagManagerArgs = {
        gtmId: tagManagerId,
        dataLayer: dataLayer,
        dataLayerName: dataLayerName
    }
    console.log(tagManagerArgs)
    TagManager.initialize(tagManagerArgs)
}

export const tagManagerSendEvent = ({event = {}}) => {
    const tagManagerId = getTagManagerId();
    if (!tagManagerId) {
        return false;
    }
    const tagManagerArgs = {
        gtmId: tagManagerId,
        event: event
    }
    console.log(tagManagerArgs)
    TagManager.initialize(tagManagerArgs)
}