'use client';
import React, {useContext, useEffect, useState} from 'react';
import {connect} from "react-redux";
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

const PostPageView = (props) => {
    const {page, preFetch = () => {}} = props;
    const [showLoader, setShowLoader] = useState(true);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    useEffect(() => {
        if (typeof preFetch === "function") {
            preFetch()
        }
    }, [])


    function itemPageInit() {
        if (!isNotEmpty(page?.pageData)) {
            return;
        }
        if (!isNotEmpty(page?.siteSettings)) {
            return;
        }
        if (!isNotEmpty(page?.postData)) {
            return;
        }
        if (!isNotEmpty(page?.postNavData)) {
            return;
        }
        setShowLoader(false)
    }

    useEffect(() => {
        itemPageInit()
    }, [page])

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
        templateId: 'postPageView',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            showLoader: showLoader,
            setShowLoader: setShowLoader,
            ...props
        }
    })
}

export default connect(
    (state) => ({
        page: state.page,
    }),
    {
        getItemMiddleware,
        setItemIdMiddleWare,
        setItemCategoryMiddleWare,
        setItemProviderMiddleware,
        getPageDataMiddleware
    }
)(PostPageView);

