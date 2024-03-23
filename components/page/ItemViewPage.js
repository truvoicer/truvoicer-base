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
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
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

const ItemViewPage = (props) => {
    const {
        getItemMiddleware, type, item, preFetch = () => {
        }
    } = props;
    const [showLoader, setShowLoader] = useState(true);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    useEffect(() => {
        if (typeof preFetch === "function") {
            preFetch()
        }
    }, []);

    function itemPageInit() {
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
                if (!isNotEmpty(item?.data)) {
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
        itemPageInit()
    }, [item])


    function defaultView() {
        return (
            <>
                {showLoader
                    ?
                    <LoaderComponent/>
                    :
                    <FetcherApp/>
                }
            </>
        )
    }

    return templateManager.getTemplateComponent({
        category: 'pages',
        templateId: 'itemViewPage',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            itemPageInit: itemPageInit,
            showLoader: showLoader,
            setShowLoader: setShowLoader,
            ...props
        }
    })
}

export default connect(
    (state) => ({
        item: state.item,
    }),
    {
        getItemMiddleware,
        setItemIdMiddleWare,
        setItemCategoryMiddleWare,
        setItemProviderMiddleware,
        getPageDataMiddleware
    }
)(ItemViewPage);

