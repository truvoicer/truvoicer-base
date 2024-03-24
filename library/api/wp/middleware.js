import {wpApiConfig} from "../../../config/wp-api-config";
import {getSessionObject} from "../../../redux/actions/session-actions";
import {siteConfig} from "@/config/site-config";
import store from "../../../redux/store";
import {SESSION_USER, SESSION_USER_ID} from "../../../redux/constants/session-constants";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {q} from "caniuse-lite/data/browserVersions";

const axios = require('axios');
const sprintf = require('sprintf-js').sprintf;


export const buildWpApiUrl = (endpoint, param = "") => {
    return sprintf(wpApiConfig.apiBaseUrl + endpoint, param);
}

// export function getStaticPostsPaths(allPosts) {
//     return allPosts.nodes.map((node) => {
//         return {
//             params: {
//                 category: node?.post_options?.postTemplateCategory?.slug,
//                 post: [node.slug]
//             }
//         }
//     });
// }

// export function getStaticPagePaths(allPages) {
//     return allPages.pageList.map((node) => {
//         let pagePaths = [];
//         if (node.url !== "/") {
//             node.url.split("/").map(item => {
//                 if (item !== '') {
//                     pagePaths.push(item);
//                 }
//             });
//         }
//         return {
//             page: pagePaths.length > 0 ? pagePaths : [node?.post_name]
//         }
//     })
// }
//
// export async function getAllPagesWithUri() {
//     return await wpResourceRequestHandler({
//         endpoint: wpApiConfig.endpoints.pageList,
//         method: 'GET',
//     });
// }


export async function getAllSingleItemPosts() {
    // return await wpResourceRequestHandler({
    //     endpoint: sprintf(wpApiConfig.endpoints.singleItemPost, {
    //         post_id: parseInt(id),
    //         post_type: postType,
    //     }),
    //     method: 'GET',
    // });
}

export async function getSingleItemPost(id, postType) {
    return await wpResourceRequestHandler({
        endpoint: sprintf(wpApiConfig.endpoints.singleItemPost, {
            post_id: id,
            post_type: postType,
        }),
        method: 'GET',
    });
}


export async function getItemViewTemplate(category, postType) {
    return await wpResourceRequestHandler({
        endpoint: sprintf(wpApiConfig.endpoints.pageTemplate, {
            category: category,
            post_type: postType,
            taxonomy: wpApiConfig.taxonomies.listingsCategory,
        }),
        method: 'GET',
    });
}

export async function getHomePage() {
    return await wpResourceRequestHandler({
        endpoint: `${wpApiConfig.endpoints.page}`,
        method: 'GET',
    });
}
export async function getSiteSettings() {
    return await wpResourceRequestHandler({
        endpoint: `${wpApiConfig.endpoints.settings}`,
        method: 'GET',
    });
}
export async function getSinglePage(slug) {
    return await wpResourceRequestHandler({
        endpoint: `${wpApiConfig.endpoints.page}`,
        query: {
            page: slug
        },
        method: 'GET',
    });
}
async function wpResourceRequestHandler(request) {
    try {
        return await wpResourceRequest(request);
    } catch (e) {
        console.error(`Error in wpResourceRequestHandler | url: ${e?.config?.url || request?.endpoint}`)
        if (e.response?.data?.message) {
            console.error(e.response?.data?.message);
        } else {
            console.error(e.message)
        }
        return false;
    }
}
export async function getPostWithTemplate(slug) {
    return await wpResourceRequestHandler({
        endpoint: sprintf(wpApiConfig.endpoints.postWithTemplate, {slug}),
        method: 'GET',
    })
}

export async function getPostTemplate({category = null, api_listings_service = null}) {
    let query = { };
    if (category) {
        query.category = category;
    }
    if (api_listings_service) {
        query.api_listings_service = api_listings_service;
    }
    return await wpResourceRequestHandler({
        endpoint: sprintf(wpApiConfig.endpoints.postTemplate),
        query,
        method: 'GET',
    })
}
export async function getPageTemplate(postType, category) {
    return await wpResourceRequestHandler({
        endpoint: sprintf(wpApiConfig.endpoints.pageTemplate, {
            category,
            post_type: postType,
            taxonomy: wpApiConfig.taxonomies.category,
        }),
        method: 'GET',
    })
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
