'use client';
import React, {useContext, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {loadBaseItemPage} from "@/truvoicer-base/redux/actions/page-actions";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {
    setItemCategoryAction,
    setItemIdAction,
    setItemProviderAction, setSingleItemPostState
} from "@/truvoicer-base/redux/actions/item-actions";
import LoaderComponent from "@/truvoicer-base/components/widgets/Loader";
import FetcherApp from "@/truvoicer-base/App";
import {
    getItemMiddleware,
    setItemCategoryMiddleWare,
    setItemIdMiddleWare, setItemProviderMiddleware
} from "@/truvoicer-base/redux/middleware/item-middleware";
import {getPageDataMiddleware} from "@/truvoicer-base/redux/middleware/page-middleware";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ItemViewPage = ({settings, pageData, provider, item_id, category, getItemMiddleware, type, itemData}) => {
    const [showLoader, setShowLoader] = useState(true);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    useEffect(() => {
        if (!isNotEmpty(pageData)) {
            return;
        }
        if (!isNotEmpty(settings)) {
            return;
        }
        loadBaseItemPage(pageData, settings)
    }, [pageData, settings])


    function itemPageInit() {
        switch (type) {
            case 'internal':
                if (!isNotEmpty(itemData)) {
                    return;
                }
                setItemProviderAction(provider)
                setItemCategoryAction(category)
                setSingleItemPostState({
                    dataKeys: itemData?.api_data_keys?.data_keys,
                    databaseId:itemData?.ID
                })
                setShowLoader(false)
                break;
            case 'external':
                if (!isNotEmpty(provider)) {
                    return;
                }
                if (!isNotEmpty(item_id)) {
                    return;
                }

                let data = {
                    [fetcherApiConfig.queryKey]: item_id,
                    provider: provider
                }

                getItemMiddleware(data);
                setItemProviderAction(provider)
                setItemCategoryAction(category)
                setItemIdAction(item_id);
                setShowLoader(false)
                break;
        }
    }

    useEffect(() => {
        itemPageInit()
    }, [provider, item_id, itemData])


    function defaultView() {
    return (
        <>
            {showLoader
                ?
                <LoaderComponent/>
                :
                <FetcherApp />
            }
        </>
    )
    }
    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'heroBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            buttonClickHandler: buttonClickHandler
        }
    })
}

export default connect(
    null,
    {
        getItemMiddleware,
        setItemIdMiddleWare,
        setItemCategoryMiddleWare,
        setItemProviderMiddleware,
        getPageDataMiddleware
    }
)(ItemViewPage);

