import {fetcherApiConfig} from "../../../config/fetcher-api-config";
import {isEmpty} from "../../utils";

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
    const url = getApiUrl(endpoint, operation, queryData);
    console.log({url})
    let config = {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_FETCHER_API_TOKEN
        }
    }
    //console.log(endpoint, operation, queryData)
    return await fetch(url, config)
}

const getApiUrl = (endpoint, operation, queryData = {}) => {
    let baseUrl;
    baseUrl = fetcherApiConfig.apiBaseUrl + vsprintf(fetcherApiConfig.endpoints[endpoint], operation);
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
