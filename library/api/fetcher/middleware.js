import {fetcherApiConfig} from "../../../config/fetcher-api-config";
import {isEmpty} from "../../utils";
import store from "@/truvoicer-base/redux/store";

const vsprintf = require('sprintf-js').vsprintf;

export const fetchData = async (endpoint, operation, queryData = {}) => {
    if (!validateEndpoint(endpoint)) {
        console.error("Endpoint not found")
    }

    try {
        const response = await fetchFromApi(endpoint, operation, queryData);
        return await response.json();
    } catch (e) {
        console.error(e)
        return false;
    }
}

const fetchFromApi = async (endpoint, operation, queryData) => {
    const siteSettings = store.getState().page.siteSettings;
    const apiToken = siteSettings?.api_token;
    if (!apiToken) {
        throw new Error("API Token not found");
    }
    const url = getApiUrl(endpoint, operation, queryData);
    console.log({url})
    let config = {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + apiToken
        }
    }
    //console.log(endpoint, operation, queryData)
    return await fetch(url, config)
}

const getApiUrl = (endpoint, operation, queryData = {}) => {
    const siteSettings = store.getState().page.siteSettings;
    const apiUrl = siteSettings?.api_url;
    if (!apiUrl) {
        throw new Error("API URL not found");
    }
    let baseUrl;
    baseUrl = apiUrl + vsprintf(fetcherApiConfig.endpoints[endpoint], operation);
    return baseUrl + (isEmpty(!buildQueryString(queryData)) ? buildQueryString(queryData) : "");
}

const validateEndpoint = (endpoint) => {
    return typeof fetcherApiConfig.endpoints[endpoint] !== "undefined";
}

const buildQueryString = (queryObject = false) => {
    if (queryObject.length === 0) {
        return "";
    }
    let esc = encodeURIComponent;
    return "?" + Object.keys(queryObject)
        .map(k => esc(k) + '=' + esc(queryObject[k]))
        .join('&');
}
