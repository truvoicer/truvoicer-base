import {isNotEmpty, isSet} from "../utils";
import {itemDataTextFilter} from "./items";
import store from "../../redux/store";

const sprintf = require("sprintf").sprintf;

export const getHeadScripts = (page_options, siteSettings) => {
    if (isSet(page_options?.headerScriptsOverride) && page_options.headerScriptsOverride) {
        return page_options.headerScripts
    }
    let headScripts = "";
    if (isSet(siteSettings?.header_scripts)) {
        headScripts += siteSettings.header_scripts;
    }
    if (isSet(page_options?.headerScripts)) {
        headScripts += page_options.headerScripts;
    }
    return headScripts;
}

export const getItemViewPageTitle = () => {
    const pageState = {...store.getState().page};

    if (isNotEmpty(pageState?.siteSettings?.blog_name) && isNotEmpty(pageState?.pageData?.title)) {
        return  sprintf("%s | %s", pageState.siteSettings.blog_name, itemDataTextFilter(pageState?.pageData?.title));
    }

    if (isNotEmpty(pageState?.siteSettings?.blog_name)) {
        return pageState.siteSettings.blog_name;
    }
    return "Loading...";
}

export const getExtraDataValue = (name, data) => {
    if (!Array.isArray(data)) {
        return null;
    }
    const paramItem = data.filter(item => item.param_name === name);
    if (paramItem.length > 0) {
        return paramItem[0].param_value;
    }
    return null;
}