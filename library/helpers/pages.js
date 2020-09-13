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