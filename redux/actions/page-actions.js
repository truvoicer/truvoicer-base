import store from "../store"
import React from "react";
import {
    setBlocksData,
    setModalComponent,
    setPageData,
    setPageError,
    setShowModal,
    setSiteSettings,
    setUserAccountMenuData,
} from "../reducers/page-reducer";
import {setCategory, setListingsData} from "../reducers/listings-reducer";
import {isSet} from "../../library/utils";
import {getListingsProviders} from "../middleware/listings-middleware";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {siteConfig} from "../../../config/site-config";
import {setBaseSidebarsJson} from "./sidebar-actions";
import {componentsConfig} from "../../../config/components-config";
import {wpApiConfig} from "../../config/wp-api-config";

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

export function loadBasePageData({page, allSettings, sidebars}) {
    const pageData = {...page};
    pageData.seo_title = getPageTitle(
        allSettings?.generalSettingsTitle,
        page?.title
    );
    setSiteSettingsAction(allSettings);
    getPageDataAction(pageData);
    setBaseSidebarsJson(sidebars)
}

export function loadBaseItemPage(pageData) {
    const data = {
        page: pageData?.listingsCategory?.itemViewTemplates?.nodes[0],
        allSettings: pageData?.allSettings,
        sidebars: pageData?.sidebars
    }
    loadBasePageData(data);
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

