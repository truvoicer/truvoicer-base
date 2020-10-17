import {isSet, uCaseFirst} from "../utils";

export function getPageSeoTitle(pageTitle, item) {
    const test = new RegExp("\\\[+(.*?)\\]","g");
    return pageTitle.replace(test, (match, value) => {
        if (isSet(item[value])) {
            return uCaseFirst(item[value]);
        }
        return "loading..."
    });
}

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