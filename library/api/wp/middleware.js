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
        // console.log(res.status)
        // console.log(res.statusText)
        // console.log(res.url)
        // console.error(res.error())
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
        // console.log(pagePaths.length > 0 ? pagePaths : [node.slug])
        return {
            params: {
                page: pagePaths.length > 0 ? pagePaths : [node.slug]
            }
        }
    })
}
export async function getPreviewPage(id, idType = 'DATABASE_ID') {
    const data = await fetchAPI(
        previewPageQuery(),
        {
            variables: {id, idType},
        }
    )
    return data.page
}

export async function getAllPostsWithUri() {
    const data = await fetchAPI( allPostsUriQuery() )
    return data?.posts
}

export async function getAllPagesWithUri() {
    const data = await fetchAPI( allPagesUriQuery() )
    return data?.pages
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

export async function getSidebar(slug, preview) {
    const data = await fetchAPI(
        sidebarQuery(),
        {
            variables: {
                slug: slug,
                onlyEnabled: !preview,
                preview,
            },
        }
    )
    return data?.sidebar
}

export async function getMenu(slug, preview) {
    const data = await fetchAPI(
        menuQuery(),
        {
            variables: {
                slug: slug,
                onlyEnabled: !preview,
                preview,
            },
        }
    )
    return data?.sidebar
}

export async function getAllSiteSettings(preview) {
    const data = await fetchAPI(
        siteSettingsQuery(),
        {
            variables: {
                onlyEnabled: !preview,
                preview,
            },
        }
    )
    return data?.allSettings
}

export async function getSinglePost(slug, preview, previewData) {
    const postPreview = preview && previewData?.post
    // The slug may be the id of an unpublished post
    const isId = Number.isInteger(Number(slug))
    const isSamePost = isId
        ? Number(slug) === postPreview.id
        : slug === postPreview.slug
    const isDraft = isSamePost && postPreview?.status === 'draft'
    const isRevision = isSamePost && postPreview?.status === 'publish'
    const data = await fetchAPI(
        singlePostQuery(isRevision),
        {
            variables: {
                id: isDraft ? postPreview.id : slug,
                idType: isDraft ? 'DATABASE_ID' : 'SLUG',
            },
        }
    )

    // Draft posts may not have an slug
    if (isDraft) data.post.slug = postPreview.id
    // Apply a revision (changes in a published post)
    if (isRevision && data.post.revisions) {
        const revision = data.post.revisions.edges[0]?.node

        if (revision) Object.assign(data.post, revision)
        delete data.post.revisions
    }

    // Filter out the main post
    data.posts.edges = data.posts.edges.filter(({node}) => node.slug !== slug)
    // If there are still 3 posts, remove the last one
    if (data.posts.edges.length > 2) data.posts.edges.pop()

    return data
}


export function getSavedItemsList(requestData, callback) {
    axios.post(buildWpApiUrl(wpApiConfig.endpoints.savedItemsList), requestData)
        .then(response => {
            callback(false, response.data);
        })
        .catch(error => {
            console.error(error)
            callback(true, error);
        });
}