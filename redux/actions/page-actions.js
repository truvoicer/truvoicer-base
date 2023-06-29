import store from "../store"
import React from "react";
import {
    setModalComponent, setNextPostNavData,
    setPageData, setPageDataOptions,
    setPageError, setPostData, setPostListData, setPostNavFromList, setPostNavIndex, setPrevPostNavData,
    setShowModal,
    setSiteSettings,
    setUserAccountMenuData,
} from "../reducers/page-reducer";
import {setCategory, setListingsData} from "../reducers/listings-reducer";
import {isNotEmpty, isObjectEmpty, isSet} from "../../library/utils";
import {getListingsProviders, getProvidersCallback} from "../middleware/listings-middleware";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {siteConfig} from "../../../config/site-config";
import {componentsConfig} from "../../../config/components-config";
import {wpApiConfig} from "../../config/wp-api-config";
import {getListingsInitialLoad} from "./listings-actions";
import {LISTINGS_BLOCK_SOURCE_API, LISTINGS_BLOCK_SOURCE_WORDPRESS} from "../constants/general_constants";

const sprintf = require("sprintf").sprintf;
export function setPageErrorAction(error) {
    store.dispatch(setPageError(error))
}

export function setShowModalAction(show) {
    store.dispatch(setShowModal(show))
}

export function setModalComponentAction(data) {
    const componentState = {...store.getState().page.modal};
    const object = Object.assign({}, componentState, data);
    store.dispatch(setModalComponent(object))
}

export function setModalContentAction(component, data, show) {
    setModalComponentAction({
        show: show,
        data: data,
        component: component
    });
}

export function getWidget(component, data) {
    if (isSet(componentsConfig.components[component]) && isSet(componentsConfig.components[component].component)) {
        const ModalContent = componentsConfig.components[component].component;
        return <ModalContent data={data} />;
    }
}

export function setSiteSettingsAction(data) {
    // console.log(data)
    store.dispatch(setSiteSettings(data))
}

export function getPageTitle(siteTitle, pageTitle) {
    if (isSet(siteTitle) && isSet(pageTitle)) {
        return sprintf("%s | %s", siteTitle, pageTitle)
    }
    return null;
}

export function loadBasePageData({page, options, settings, post = {}, postNavigation = {}}) {
    const postNavState = store.getState().page.postNavData;

    const pageData = {...page};
    pageData.seo_title = getPageTitle(
        settings?.blogname,
        page?.post_title
    );
    setSiteSettingsAction(settings);
    setPageDataAction(pageData);
    setPageDataOptionsAction(options);
    setPostDataAction(post)

    if (!postNavState.fromList) {
        setNextPostNavDataAction(postNavigation?.next_post);
    }

    if (!postNavState.fromList) {
        setPrevPostNavDataAction(postNavigation?.prev_post);
    }
}

export function loadBaseItemPage(pageData, settings) {
    const data = {
        page: pageData,
        truFetcherSettings: settings
    }
    loadBasePageData(data);
}

export function setListingsBlocksDataAction(data) {
    if (!isSet(data)) {
        return false;
    }
    if (data !== null) {
        console.log({data})
        // console.log(data)
        // store.dispatch(setBlocksData(blocksObject))
        store.dispatch(setListingsData(data))
        switch (data?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                store.dispatch(setCategory(data.listings_category.slug))
                getListingsInitialLoad();
                break;
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                if (isNotEmpty(data.api_listings_category)) {
                    store.dispatch(setCategory(data.api_listings_category))
                    getListingsProviders(data, "providers", getProvidersCallback)
                }
                break;
        }
    }
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


export function getUserAccountMenuAction() {
    fetch(buildWpApiUrl(wpApiConfig.endpoints.menu, siteConfig.myAccountMenu))
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(json => {
            setUserAccountMenuAction(json)
        })
        .catch(error => {
            console.error(error)
            store.dispatch(setPageError(error.message))
        });
}

