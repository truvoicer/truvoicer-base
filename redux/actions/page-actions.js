import store from "../store"
import {
    setNextPostNavData,
    setPageData,
    setPageDataOptions,
    setPageError,
    setPageStatus,
    setPostData,
    setPostListData,
    setPostNavFromList,
    setPostNavIndex,
    setPrevPostNavData,
    setSearchParamPage,
    setSearchParamQuery,
    setSearchParamSortBy,
    setSearchParamSortOrder,
    setSearchParamPageSize,
    setSiteSettings,
    setUserAccountMenuData,
} from "../reducers/page-reducer";
import {isNotEmpty, isSet} from "../../library/utils";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {siteConfig} from "@/config/site-config";
import {wpApiConfig} from "../../config/wp-api-config";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const sprintf = require('sprintf-js').sprintf;

export function setPageStatusAction(pageStatus) {
    store.dispatch(setPageStatus(pageStatus))
}
export function setPageErrorAction(error) {
    store.dispatch(setPageError(error))
}

export function setSearchParamPageAction(query) {
    store.dispatch(setSearchParamPage(query))
}
export function setSearchParamSortOrderAction(query) {
    store.dispatch(setSearchParamSortOrder(query))
}
export function setSearchParamSortByAction(query) {
    store.dispatch(setSearchParamSortBy(query))
}
export function setSearchParamQueryAction(query) {
    store.dispatch(setSearchParamQuery(query))
}

export function setSearchParamPageSizeAction(query) {
    store.dispatch(setSearchParamPageSize(query))
}

export function setSiteSettingsAction(data) {
    store.dispatch(setSiteSettings(data))
}

export function getPageTitle(siteTitle, pageTitle) {
    if (isSet(siteTitle) && isSet(pageTitle)) {
        return sprintf("%s | %s", siteTitle, pageTitle)
    }
    return null;
}

export function loadBasePageData({page, settings, post = {}, postNavigation = {}}) {
    const postNavState = store.getState().page.postNavData;

    const pageData = {...page};
    pageData.seo_title = getPageTitle(
        settings?.blogname,
        page?.post_title
    );
    setSiteSettingsAction(settings);
    setPageDataAction(pageData);
    setPageDataOptionsAction(page?.page_options);
    setPostDataAction(post)

    if (!postNavState.fromList) {
        setNextPostNavDataAction(postNavigation?.next_post);
    }

    if (!postNavState.fromList) {
        setPrevPostNavDataAction(postNavigation?.prev_post);
    }
}

export function loadBaseItemPage({page, settings, postNav = {}}) {
    const data = {
        page: page,
        settings: settings,
        postNavigation: postNav
    }
    loadBasePageData(data);
}


export function setPageDataAction(data) {
    store.dispatch(setPageData(data))
}

export function setPageDataOptionsAction(data) {
    store.dispatch(setPageDataOptions(data))
}

export function setPostDataAction(data) {
    store.dispatch(setPostData(data))
}

export function setPostListDataAction(data) {
    store.dispatch(setPostListData(data))
}

export function setPostNavFromListAction(fromList) {
    store.dispatch(setPostNavFromList(fromList))
}

export function setPostNavIndexAction(index) {
    store.dispatch(setPostNavIndex(index))
}

export function setNextPostNavDataAction(data) {
    if (!isNotEmpty(data)) {
        store.dispatch(setNextPostNavData({}))
    } else {
        store.dispatch(setNextPostNavData(data))
    }
}
export function setPrevPostNavDataAction(data) {
    if (!isNotEmpty(data)) {
        store.dispatch(setPrevPostNavData({}))
    } else {
        store.dispatch(setPrevPostNavData(data))
    }
}

export function isUserAccountPage(pageData) {
    if (!isSet(pageData) || !isSet(pageData.blocksJSON) || pageData.blocksJSON === null) {
        return false;
    }
    const blocksObject = JSON.parse(pageData.blocksJSON)
    return isSet(blocksObject.tru_fetcher_listings) &&
        isSet(blocksObject.tru_fetcher_listings.tru_fetcher_user_area);

}

export function setUserAccountMenuAction(menu) {
    store.dispatch(setUserAccountMenuData(menu))
}


export async function getUserAccountMenuAction() {
    try {
        const response = await wpResourceRequest({
            protectedRequest: true,
            endpoint: sprintf(wpApiConfig.endpoints.menu, siteConfig.myAccountMenu),
            method: 'GET',
            query: {
                blocks: 'user_account_block'
            }
        })
        const responseData = await response.json();
        if (Array.isArray(responseData)) {
            setUserAccountMenuAction(responseData);
        }
    } catch (error) {
        console.error(error)
        store.dispatch(setPageError(error.message))
    }
}

