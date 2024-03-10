import {isNotEmpty, isObjectEmpty} from '../../utils';
import {wpApiConfig} from '../../../config/wp-api-config';
import {isObject} from 'underscore';
import {REQUEST_GET} from '../../constants/request-constants';
import {getSignedJwt} from "@/truvoicer-base/library/api/auth/jwt-helpers";
import {getSessionObject} from "@/truvoicer-base/redux/actions/session-actions";

const axios = require('axios');
const sprintf = require('sprintf-js').sprintf;

function getHeaders(config) {
  return config.headers;
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
  //console.log('token', token);
  if (!token) {
    return false;
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function checkSessionTokenRequest({
  onSuccess = undefined,
  onError = null,
}) {
  const request = requestResponseHandler(
    runRequest({
      endpoint: `${wpApiConfig.endpoints.token}/validate`,
      method: REQUEST_GET,
      config: wpApiConfig,
      protectedReq: true,
    }),
    onSuccess,
    onError,
  );
  if (!request) {
    return false;
  }
}


export async function fetchSidebarRequest (sidebar) {
  if (!isNotEmpty(sidebar)) {
    console.warn('Sidebar not set');
    return false;
  }
  return wpResourceRequest({
    endpoint: sprintf(wpApiConfig.endpoints.sidebar, sidebar),
    method: 'GET',
    query: {
        sidebar,
    }
  });
}

export async function wpResourceRequest({
  endpoint,
  query = {},
  data = {},
  method,
  upload = false,
  protectedReq = false,
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
  });
}

function requestResponseHandler(request, onSuccess, onError) {
  if (request) {
    request
      .then(response => {
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(response.data, response);
        }
      })
      .catch((error) => {
        if (onError && typeof onSuccess === 'function') {
          onError(error?.response || error);
        }
      });
  }
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
  headers = {},
}) {
  let buildHeadersData = getHeaders(config);
  const authHeader = getAuthHeader(protectedReq);
  if (!authHeader) {
    return false;
  }
  buildHeadersData = {...buildHeadersData, ...authHeader};

  if (upload) {
    buildHeadersData = {
      ...buildHeadersData,
      'Content-Type': 'multipart/form-data',
    };
  }
  return {...buildHeadersData, ...headers};
}
export async function runRequest({
  config,
  method,
  endpoint,
  query = {},
  data = {},
  headers = {},
  upload = false,
  protectedReq = false,
}) {
  const requestUrl = buildRequestUrl(`${config.apiBaseUrl}${endpoint}`, query);
  console.log({requestUrl})
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
    url: requestUrl,
    headers: buildHeadersData,
    data: {},
  };
  if (isObject(data)) {
    request.data = data;
  }
  return await axios.request(request);
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
