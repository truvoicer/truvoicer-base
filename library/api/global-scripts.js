import TagManager from "react-gtm-module";
import store from "../../redux/store";
import {isNotEmpty} from "../utils";

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
    TagManager.initialize(tagManagerArgs)
}
