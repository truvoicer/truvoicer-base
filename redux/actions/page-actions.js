import store from "../store"
import React from "react";
import {
    setBlocksData,
    setPageData,
    setPageError,
    setUserAccountMenuData,
    setShowModal,
    setModalComponent, setSiteSettings,
} from "../reducers/page-reducer";
import {setCategory, setListingsData} from "../reducers/listings-reducer";
import {isSet} from "../../library/utils";
import {getListingsProviders} from "../middleware/listings-middleware";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {siteConfig} from "../../../config/site-config";
import {setSidebarAction} from "./sidebar-actions";
import {
    FOOTER_REQUEST,
    LEFT_SIDEBAR_REQUEST, NAVBAR_REQUEST,
    RIGHT_SIDEBAR_REQUEST,
    TOPBAR_REQUEST
} from "../constants/sidebar-constants";
import {componentsConfig} from "../../../config/components-config";
import {wpApiConfig} from "../../config/wp-api-config";

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

export function loadPage(pageData, allSiteSettings, topBar, footerBar = [], navBar = [], leftSidebar = [], rightSidebar = []) {
    setSiteSettingsAction(allSiteSettings);
    getPageDataAction(pageData);

    if (isSet(navBar.widgets_json) && navBar.widgets_json !== "" && navBar.widgets_json !== null) {
        setSidebarAction(JSON.parse(navBar.widgets_json), NAVBAR_REQUEST);
    }
    if (isSet(topBar.widgets_json) && topBar.widgets_json !== "" && topBar.widgets_json !== null) {
        setSidebarAction(JSON.parse(topBar.widgets_json), TOPBAR_REQUEST);
    }
    if (isSet(footerBar.widgets_json) && footerBar.widgets_json !== "" && footerBar.widgets_json !== null) {
        setSidebarAction(JSON.parse(footerBar.widgets_json), FOOTER_REQUEST);
    }
    if (isSet(leftSidebar.widgets_json) && leftSidebar.widgets_json !== "" && leftSidebar.widgets_json !== null) {
        setSidebarAction(JSON.parse(leftSidebar.widgets_json), LEFT_SIDEBAR_REQUEST);
    }
    if (isSet(rightSidebar.widgets_json) && rightSidebar.widgets_json !== "" && rightSidebar.widgets_json !== null) {
        setSidebarAction(JSON.parse(rightSidebar.widgets_json), RIGHT_SIDEBAR_REQUEST);
    }
}

export function getPageDataAction(data) {
    // console.log(data)
    store.dispatch(setPageData(data))
    if (!isSet(data) || !isSet(data.blocksJSON) || data.blocksJSON === null) {
        return false;
    }
    const blocksObject = JSON.parse(data.blocksJSON)
    if (blocksObject !== null) {
        store.dispatch(setBlocksData(blocksObject))
        store.dispatch(setListingsData(blocksObject.tru_fetcher_listings))
        if (isSet(blocksObject.tru_fetcher_listings) &&
            isSet(blocksObject.tru_fetcher_listings.listing_block_category) &&
            isSet(blocksObject.tru_fetcher_listings.listing_block_category.slug)
        ) {
            const category = blocksObject.tru_fetcher_listings.listing_block_category.slug
            store.dispatch(setCategory(category))
            getListingsProviders(category)
        }
    }
}

export function isUserAccountPage(pageData) {
    if (!isSet(pageData) || !isSet(pageData.blocksJSON) || pageData.blocksJSON === null) {
        return false;
    }
    const blocksObject = JSON.parse(pageData.blocksJSON)
    if (isSet(blocksObject.tru_fetcher_listings) &&
        isSet(blocksObject.tru_fetcher_listings.tru_fetcher_user_area)) {
        return true;
    }
    return false;
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

