import {singlePageQuery} from "../../graphql/queries/single-page";
import {siteSettingsQuery} from "../../graphql/queries/site-settings";
import {sidebarQuery} from "../../graphql/queries/sidebar";
import {allPagesUriQuery} from "../../graphql/queries/all-pages-uri";
import {previewPostQuery} from "../../graphql/queries/preview-post";
import {allPostsUriQuery} from "../../graphql/queries/all-posts-uri";
import {previewPageQuery} from "../../graphql/queries/preview-page";
import {singlePostQuery} from "../../graphql/queries/single-post";
import {itemViewTemplateQuery} from "../../graphql/queries/item-view-template";
import {menuQuery} from "../../graphql/queries/menu";
import {wpApiConfig} from "../../../config/wp-api-config";
import {getSessionObject} from "../../../redux/actions/session-actions";
import {singleItemTemplateQuery} from "../../graphql/queries/single-item-post-template";
import {siteConfig} from "../../../../config/site-config";
import store from "../../../redux/store";
import {SESSION_USER, SESSION_USER_ID} from "../../../redux/constants/session-constants";
import useSWR from "swr";

const axios = require('axios');
const sprintf = require("sprintf").sprintf;
const API_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL

const fetcher = (...args) => fetch(...args).then(res => res.json())

export const buildWpApiUrl = (endpoint, param = "") => {
    return sprintf(wpApiConfig.apiBaseUrl + endpoint, param);
}

export function getSidebar (sidebar) {
    const { data, error } = useSWR(buildWpApiUrl(wpApiConfig.endpoints.sidebar, sidebar), fetcher)
    return {
        sidebarData: data,
        isLoading: !error && !data,
        isError: error
    }
}

async function fetchAPI(query, {variables} = {}) {
    const headers = {'Content-Type': 'application/json'}

    if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
        headers[
            'Authorization'
            ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
    }
    const request = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables,
        }),
    };
    const res = await fetch(API_URL, request);

    if (res.status !== 200) {
        throw new Error('Error, response status not 200')
    }

    const json = await res.json()
    if (json.errors) {
        // console.log(json)
        console.error(json.errors)
        throw new Error('Failed to fetch API')
    }
    return json.data
}

export async function getPreviewPost(id, idType = 'DATABASE_ID') {
    const data = await fetchAPI(
        previewPostQuery(),
        {
            variables: {id, idType},
        }
    )
    return data.post
}

export function getStaticPagePaths(allPages) {
    return allPages.nodes.map((node) => {
        let pagePaths = [];
        if (node.uri !== "/") {
            node.uri.split("/").map(item => {
                if (item !== '') {
                    pagePaths.push(item);
                }
            });
        }
        return {
            params: {
                page: pagePaths.length > 0 ? pagePaths : [node.slug]
            }
        }
    })
}

export async function getAllPagesWithUri() {
    const data = await fetchAPI(allPagesUriQuery())
    return data?.pages
}

export async function getSingleItemPost(id, type, preview) {
    return await fetchAPI(
        singleItemTemplateQuery(),
        {
            variables: {
                id: id,
                idType: type,
                onlyEnabled: !preview,
                preview,
            },
        }
    );
}

export async function getItemViewTemplate(category, type, preview) {
    return await fetchAPI(
        itemViewTemplateQuery(),
        {
            variables: {
                id: category,
                idType: type,
                onlyEnabled: !preview,
                preview,
            },
        }
    );
}

export async function getSinglePage(slug, type, preview) {
    return await fetchAPI(
        singlePageQuery(),
        {
            variables: {
                id: slug,
                idType: type,
                onlyEnabled: !preview,
                preview,
            },
        }
    );
}

export function protectedFileUploadApiRequest(endpoint, requestData, callback = false, headers = {}) {
    const userId = store.getState().session[SESSION_USER][SESSION_USER_ID];
    requestData.append("action", "wp_handle_upload");
    requestData.append("user_id", userId);
    requestData.append("internal_category", siteConfig.internalCategory);
    requestData.append("internal_provider_name", siteConfig.internalProviderName);
    const defaultHeaders = {
        'Authorization': 'Bearer ' + getSessionObject().token
    };
    let config = {
        url: endpoint,
        method: "post",
        data: requestData,
        headers: {...defaultHeaders, ...headers}
    }
    const getRequest = axios.request(config)
    if (!callback) {
        return getRequest;
    }
    getRequest.then(response => {
        callback(false, response.data);
    })
    .catch(error => {
        console.error(error)
        callback(true, error);
    });
}

export function protectedApiRequest(endpoint, requestData, callback = false, headers = {}) {
    const userId = store.getState().session[SESSION_USER][SESSION_USER_ID];
    const extraData = {
        internal_category: siteConfig.internalCategory,
        internal_provider_name: siteConfig.internalProviderName,
        user_id: userId
    };
    const defaultHeaders = {
        'Authorization': 'Bearer ' + getSessionObject().token
    };
    let config = {
        url: endpoint,
        method: "post",
        data: {...requestData, ...extraData},
        headers: {...defaultHeaders, ...headers}
    }
    const getRequest = axios.request(config)
    if (!callback) {
        return getRequest;
    }
    getRequest.then(response => {
        callback(false, response.data);
    })
    .catch(error => {
        console.error(error)
        callback(true, error);
    });
}

export function publicApiRequest(endpoint, requestData = {}, callback = false, method = "get") {
    let config = {
        url: endpoint,
        method: method,
    }
    if (method === "get") {
        config.params = requestData
    } else if(method === "post") {
        config.data = requestData;
    }
    const getRequest = axios.request(config)
    if (!callback) {
        return getRequest;
    }
    getRequest.then(response => {
        callback(false, response.data);
    })
        .catch(error => {
            console.error(error)
            callback(true, error);
        });
}
