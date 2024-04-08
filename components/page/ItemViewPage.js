'use client';
import React, {useContext, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {loadBaseItemPage} from "@/truvoicer-base/redux/actions/page-actions";
import {
    setItemCategoryAction, setItemDataAction,
    setItemIdAction,
    setItemProviderAction, setItemTypeAction, setSingleItemPostState
} from "@/truvoicer-base/redux/actions/item-actions";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import {
    setItemCategoryMiddleWare,
    setItemIdMiddleWare, setItemProviderMiddleware
} from "@/truvoicer-base/redux/middleware/item-middleware";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import AppLoader from "@/truvoicer-base/AppLoader";
import {templateConfig} from "@/config/template-config";

const ItemViewPage = (props) => {
    const {
        type,
        item,
        itemData,
        category,
        provider,
        item_id,
        settings,
        page
    } = props;
    const [showLoader, setShowLoader] = useState(true);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function itemPageInit() {
        loadBaseItemPage(page, settings)
        setItemDataAction(itemData)
        setItemTypeAction(type);
        switch (type) {
            case 'internal':
                if (!isNotEmpty(item)) {
                    return;
                }
                setItemProviderAction(provider)
                setItemCategoryAction(category)
                setSingleItemPostState({
                    dataKeys: itemData?.single_item?.data_keys,
                    databaseId: itemData?.ID
                })
                break;
            case 'external':
                if (!isNotEmpty(provider)) {
                    return;
                }
                if (!isNotEmpty(item_id)) {
                    return;
                }

                setItemProviderAction(provider)
                setItemCategoryAction(category)
                setItemIdAction(item_id);
                break;
        }
    }
    function itemPageValidate() {
        if (!isNotEmpty(item?.provider)) {
            return;
        }
        if (!isNotEmpty(item?.category)) {
            return;
        }
        if (!isNotEmpty(item?.itemId)) {
            return;
        }

        switch (type) {
            case 'internal':
                if (!isNotEmpty(item)) {
                    return;
                }
                setShowLoader(false)
                break;
            case 'external':
                setShowLoader(false)
                break;
        }
    }

    useEffect(() => {
        itemPageValidate()
    }, [item])
    useEffect(() => {
        itemPageInit()
    }, [])



        return (
            <>
                {showLoader
                    ?
                    templateManager.render(<LoaderComponent/>)
                    :
                    <AppLoader templateConfig={templateConfig()} page={page} />
                }
            </>
        )
}
ItemViewPage.category = 'pages';
ItemViewPage.templateId = 'itemViewPage';
export default connect(
    (state) => {
        return {
            item: state.item,
        }

    },
    {
        setItemIdMiddleWare,
        setItemCategoryMiddleWare,
        setItemProviderMiddleware,
    }
)(ItemViewPage);

