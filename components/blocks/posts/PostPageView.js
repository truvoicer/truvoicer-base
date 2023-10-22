'use client';
import React, {useContext, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {loadBaseItemPage, loadBasePageData, setPostDataAction} from "@/truvoicer-base/redux/actions/page-actions";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {
    setItemCategoryAction, setItemDataAction,
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

const PostPageView = (props) => {
    const {settings, template, post, navigation} = props;
    const [showLoader, setShowLoader] = useState(true);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    useEffect(() => {
        if (!isNotEmpty(template)) {
            return;
        }
        if (!isNotEmpty(settings)) {
            return;
        }
        loadBasePageData({
            settings,
            page: template,
            postNavigation: navigation,
            post,
        })
    }, [template, settings, post, navigation])

    function itemPageInit() {
        if (!isNotEmpty(template)) {
            return;
        }
        if (!isNotEmpty(settings)) {
            return;
        }
        if (!isNotEmpty(post)) {
            return;
        }
        if (!isNotEmpty(navigation)) {
            return;
        }
        setShowLoader(false)
    }

    useEffect(() => {
        itemPageInit()
    }, [template, settings, post, navigation])

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
    null,
    {
        getItemMiddleware,
        setItemIdMiddleWare,
        setItemCategoryMiddleWare,
        setItemProviderMiddleware,
        getPageDataMiddleware
    }
)(PostPageView);

