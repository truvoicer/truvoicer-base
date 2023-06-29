'use client';
import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {useRouter} from "next/router";
import {loadBaseItemPage} from "@/truvoicer-base/redux/actions/page-actions";
import {isSet} from "underscore";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {
    setItemCategoryAction,
    setItemIdAction,
    setItemProviderAction
} from "@/truvoicer-base/redux/actions/item-actions";
import LoaderComponent from "@/truvoicer-base/components/widgets/Loader";
import FetcherApp from "@/views/App";
import {
    getItemMiddleware,
    setItemCategoryMiddleWare,
    setItemIdMiddleWare, setItemProviderMiddleware
} from "@/truvoicer-base/redux/middleware/item-middleware";
import {getPageDataMiddleware} from "@/truvoicer-base/redux/middleware/page-middleware";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const ItemViewPage = ({settings, pageData, provider, item_id, getItemMiddleware}) => {
    const [showLoader, setShowLoader] = useState(true);
    useEffect(() => {
        if (!isNotEmpty(pageData) && !isNotEmpty(settings)) {
            loadBaseItemPage(pageData, settings)
            setShowLoader(false)
        }
    }, [pageData, settings])

    useEffect(() => {
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
        setItemCategoryAction("recruitment")
        setItemIdAction(item_id)
    }, [provider, item_id])

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

