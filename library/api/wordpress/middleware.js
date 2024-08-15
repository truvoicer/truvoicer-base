import {isNotEmpty, isObjectEmpty} from '../../utils';
import {wpApiConfig} from '../../../config/wp-api-config';
import {isObject} from 'underscore';
import {REQUEST_GET, REQUEST_POST} from '../../constants/request-constants';
import {getSignedJwt} from "@/truvoicer-base/library/api/auth/jwt-helpers";
import {getSessionObject} from "@/truvoicer-base/redux/actions/session-actions";
import {getSiteSettings} from "@/truvoicer-base/library/api/wp/middleware";

const sprintf = require('sprintf-js').sprintf;

export async function getGlobalMeta() {
    const settings = await getSiteSettings();
    if (!isNotEmpty(settings?.settings?.google_login_client_id)) {
        return false;
    }
    let extraData = {};
    let blogName = settings?.settings?.blogname || '';
    let favicon = settings?.settings?.favicon;

    if (favicon) {
        extraData = {
            icons: {
                icon: favicon,
                shortcut: favicon,
                apple: favicon,
                other: {
                    rel: 'icon',
                    url: favicon,
                },
            },
        };
    }
    return {
        title: {
            template: `%s | ${blogName}`,
            default: blogName, // a default is required when creating a template
        },
        other: {
            'google_login_client_id': settings?.settings?.google_login_client_id
        },
        ...extraData
    };
}

function getHeaders(config, upload = false) {
    if (upload) {
        return config.headers.upload;
    }
    return config.headers.default;
}

export function buildPublicBearerToken() {
    const payloadSecret = wpApiConfig.appSecret;
    return getSignedJwt({
        secret: payloadSecret,
        payload: {
            type: 'app',
        },
    });
}

function getAuthHeader(protectedReq = false) {
    let token;
    if (protectedReq) {
        token = getProtectedSessionToken();
    } else {
        token = getPublicSessionToken();
    }

    if (!token) {
        return false;
    }
    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function fetchSidebarRequest(sidebar) {
    if (!isNotEmpty(sidebar)) {
        console.warn('Sidebar not set');
        return false;
    }
    const request = await wpResourceRequest({
        endpoint: sprintf(wpApiConfig.endpoints.sidebar, sidebar),
        method: 'GET',
        query: {
            sidebar,
        }
    });
    return await request.json();
}

export async function wpResourceRequest({
    endpoint,
    query = {},
    data = {},
    method,
    upload = false,
    protectedReq = false,
    headers = null
}) {
    if (!method) {
        throw new Error('Method not set');
    }
    return await runRequest({
        config: wpApiConfig,
        method: method,
        endpoint,
        query,
        data,
        upload,
        protectedReq,
        headers
    });
}

export function getProtectedSessionToken() {
    const sessionObject = getSessionObject();
    if (!sessionObject) {
        return false;
    }
    return sessionObject?.token;
}

export function getPublicSessionToken() {
    return buildPublicBearerToken();
}

function buildHeaders({
    protectedReq = false,
    upload = false,
    config,
    headers = null,
}) {
    let buildHeadersData = isObject(headers)? headers : getHeaders(config, upload);
    const authHeader = getAuthHeader(protectedReq);
    if (!authHeader) {
        return false;
    }
    buildHeadersData = {...buildHeadersData, ...authHeader};

    if (upload) {
        buildHeadersData = {
            ...buildHeadersData,
        };
    }

    return buildHeadersData;
}

export async function runRequest({
    config,
    method,
    endpoint,
    query = {},
    data = {},
    headers = null,
    upload = false,
    protectedReq = false,
}) {
    const requestUrl = buildRequestUrl(`${config.apiBaseUrl}${endpoint}`, query);
    const buildHeadersData = buildHeaders({
        protectedReq,
        upload,
        config,
        headers,
    });
    if (!buildHeadersData) {
        return false;
    }
    let request = {
        method,
        headers: buildHeadersData,
    };
    let body;
    if (upload) {
        body = data;
    } else {
        body = JSON.stringify(data);
    }
    switch (method) {
        case REQUEST_GET:
        case 'get':
            request = {
                ...request,
                method: 'GET',
            };
            break;
        case REQUEST_POST:
        case 'post':
            request = {
                ...request,
                method: 'POST',
                body,
            };
            break;
        default:
            throw new Error(`Method not supported ${method}`);
    }
    console.log(request)
    return await fetch(
        requestUrl,
        request,
    );
}

function buildRequestUrl(url, queryObject = {}) {
    let queryString = '';
    if (!isObjectEmpty(queryObject)) {
        queryString = `/?${buildQueryString(queryObject)}`;
    }
    return `${url}${queryString}`;
}

function buildQueryString(queryObject) {
    return Object.keys(queryObject)
        .map(key => {
            return `${key}=${queryObject[key]}`;
        })
        .join('&');
}
