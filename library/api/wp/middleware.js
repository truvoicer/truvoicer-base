import {allPagesUriQuery} from "../../graphql/queries/all-pages-uri";
import {allPostsQuery} from "../../graphql/queries/all-posts-uri";
import {wpApiConfig} from "../../../config/wp-api-config";
import {getSessionObject} from "../../../redux/actions/session-actions";
import {siteConfig} from "@/config/site-config";
import store from "../../../redux/store";
import {SESSION_USER, SESSION_USER_ID} from "../../../redux/constants/session-constants";
import useSWR from "swr";
import {allSingleItemPostsQuery} from "../../graphql/queries/all-single-item-posts";
import {allCategoriesQuery} from "../../graphql/queries/all-categories-uri";
import {comparisonItemTemplateQuery} from "../../graphql/queries/single-comparison-item-post-template";
import {allComparisonItemsPostsQuery} from "../../graphql/queries/all-comparison-items-posts";
import {isNotEmpty} from "../../utils";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const axios = require('axios');
const sprintf = require("sprintf").sprintf;
const API_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL


export const buildWpApiUrl = (endpoint, param = "") => {
    return sprintf(wpApiConfig.apiBaseUrl + endpoint, param);
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
        const errorMessage = json.errors.map(error => error.message).join(", ");
        throw new Error(errorMessage)
    }
    return json.data
}


export function getStaticPostsPaths(allPosts) {
    return allPosts.nodes.map((node) => {
        return {
            params: {
                category: node?.post_options?.postTemplateCategory?.slug,
                post: [node.slug]
            }
        }
    });
}

export function getStaticCategoriesPaths(allPosts) {
    return allPosts.nodes.map((node) => {
        return {
            params: {
                category: node?.slug
            }
        }
    });
}

export function getStaticSingleItemPaths(allSingleItems) {
    return allSingleItems.nodes.map((node) => {
        return {
            params: {
                item_id: node.databaseId.toString()
            }
        }
    });
}

export function getStaticComparisonItemsPaths(allSingleItems) {
    return allSingleItems.nodes.map((node) => {
        let category = null;
        if (isNotEmpty(node?.listingsCategories?.nodes[0]?.slug)) {
            category = node.listingsCategories.nodes[0].slug;
        }
        return {
            params: {
                item_slug: node.slug,
                listings_category: category
            }
        }
    });
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

export async function getAllPosts() {
    const data = await fetchAPI(allPostsQuery())
    return data?.posts
}

export async function getAllCategories() {
    const data = await fetchAPI(allCategoriesQuery())
    return data?.categories
}

export async function getAllSingleItemPosts() {
    const data = await fetchAPI(allSingleItemPostsQuery())
    return data?.fetcherSingleItems
}

export async function getAllComparisonItemPosts() {
    const data = await fetchAPI(allComparisonItemsPostsQuery())
    return data?.fetcherSingleComparisons
}

export async function getSingleItemPost(id, postType) {
    const results = await wpResourceRequest({
        endpoint: sprintf(wpApiConfig.endpoints.singleItemPost, {
            post_id: parseInt(id),
            post_type: postType,
        }),
        method: 'GET',
    })
    return results?.data;
}

export async function getSingleComparisonPost(id, type, preview) {
    return await fetchAPI(
        comparisonItemTemplateQuery(),
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

export async function getItemViewTemplate(category, postType, preview) {
    const results = await wpResourceRequest({
        endpoint: sprintf(wpApiConfig.endpoints.pageTemplate, {
            category: category,
            post_type: postType,
            taxonomy: wpApiConfig.taxonomies.listingsCategory,
        }),
        method: 'GET',
    })
    return results?.data;
}

export async function getHomePage() {
    const results = await wpResourceRequest({
        endpoint: `${wpApiConfig.endpoints.page}`,
        method: 'GET',
    })
    return results?.data;
}
export async function getSiteSettings() {
    const results = await wpResourceRequest({
        endpoint: `${wpApiConfig.endpoints.settings}`,
        method: 'GET',
    })
    return results?.data;
}
export async function getSinglePage(slug) {
    const results = await wpResourceRequest({
        endpoint: `${wpApiConfig.endpoints.page}`,
        query: {
            page: slug
        },
        method: 'GET',
    })
    return results?.data;
}

export async function getPostWithTemplate(slug) {
    const results = await wpResourceRequest({
        endpoint: sprintf(wpApiConfig.endpoints.postWithTemplate, {slug}),
        method: 'GET',
    })
    return results?.data;
}

export async function getPageTemplate(postType, category) {
    const results = await wpResourceRequest({
        endpoint: sprintf(wpApiConfig.endpoints.pageTemplate, {
            category,
            post_type: postType,
            taxonomy: wpApiConfig.taxonomies.category,
        }),
        method: 'GET',
    })
    return results?.data;
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
