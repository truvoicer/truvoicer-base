import {fetcherApiConfig} from "../../../config/fetcher-api-config";
import {isEmpty, isNotEmpty} from "../../utils";
import store from "@/truvoicer-base/redux/store";
import {REQUEST_GET, REQUEST_POST} from "@/truvoicer-base/library/constants/request-constants";

const vsprintf = require('sprintf-js').vsprintf;
export class FetcherApiMiddleware {

    apiKey = null;
    apiUrl = null;
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }
    setApiUrl(apiUrl) {
        this.apiUrl = apiUrl;
    }
    buildApiUrl() {
        if (isNotEmpty(this.apiUrl)) {
            return this.apiUrl;
        }
        const siteSettings = store.getState().page.siteSettings;
        const apiUrl = siteSettings?.api_url;
        if (!apiUrl) {
            throw new Error("API URL not found");
        }
        return apiUrl;
    }
    getApiKey() {
        if (isNotEmpty(this.apiKey)) {
            return this.apiKey;
        }
        const siteSettings = store.getState().page.siteSettings;
        const apiToken = siteSettings?.frontend_api_token;
        if (!apiToken) {
            throw new Error("API Token not found");
        }
        return apiToken;
    }
    async fetchData(endpoint, operation, queryData = {}, data = {}, method = REQUEST_GET) {
        if (!this.validateEndpoint(endpoint)) {
            console.error("Endpoint not found")
        }

        try {
            const response = await this.fetchFromApi(endpoint, operation, queryData, data, method);
            return await response.json();
        } catch (e) {
            console.error(e);
            console.log(e)
            return false;
        }
    }

     async fetchFromApi(endpoint, operation, queryData, data = {}, method = REQUEST_GET) {
        const apiToken = this.getApiKey();
        const url = this.getApiUrl(endpoint, operation, queryData);
        let config = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + apiToken
            }
        }

        switch (method) {
            default:
                config = {
                    ...config,
                    method: 'GET',
                };
                break;
            case REQUEST_POST:
                config = {
                    ...config,
                    method: 'POST',
                    body: JSON.stringify(data),
                };
                break;
        }
        return await fetch(url, config)
    }

    getApiUrl(endpoint, operation, queryData = {}) {
        const apiUrl = this.buildApiUrl();
        if (!apiUrl) {
            throw new Error("API URL not found");
        }
        let baseUrl;
        baseUrl = apiUrl + vsprintf(fetcherApiConfig.endpoints[endpoint], operation);
        return baseUrl + (isEmpty(!this.buildQueryString(queryData)) ? this.buildQueryString(queryData) : "");
    }

    validateEndpoint(endpoint) {
        return typeof fetcherApiConfig.endpoints[endpoint] !== "undefined";
    }

    buildQueryString(queryObject = false) {
        if (queryObject.length === 0) {
            return "";
        }
        let esc = encodeURIComponent;
        return "?" + Object.keys(queryObject)
            .map(k => esc(k) + '=' + esc(queryObject[k]))
            .join('&');
    }
}
