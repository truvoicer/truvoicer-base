'use client';
import React, {useEffect} from "react";
import {
    setPasswordResetKeyAction,
    setSessionUserIdAction,
} from "@/truvoicer-base/redux/actions/session-actions";
import {isObject, isObjectEmpty} from "@/truvoicer-base/library/utils";
import AppLoader from "@/truvoicer-base/AppLoader";
import {templateConfig} from "@/config/template-config";
import {
    loadBasePageData,
    setSearchParamPageAction, setSearchParamPageSizeAction, setSearchParamQueryAction, setSearchParamSortByAction,
    setSearchParamSortOrderAction
} from "@/truvoicer-base/redux/actions/page-actions";
import {connect} from "react-redux";
import {APP_LOADED, APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";
import {setAppLoadedAction} from "@/truvoicer-base/redux/actions/app-actions";
import {setAppRequestedRoute} from "@/truvoicer-base/redux/reducers/app-reducer";
import {usePathname, useSearchParams} from "next/navigation";
import {
    setSearchParamPage, setSearchParamPageSize, setSearchParamQuery,
    setSearchParamSortBy,
    setSearchParamSortOrder
} from "@/truvoicer-base/redux/reducers/page-reducer";

const FetcherApp = ({
    app,
    page,
    pageData,
    settings,
    pageOptions = {},
    isResetKey = false
}) => {
    const searchParams = useSearchParams();
    const searchParamPage = searchParams.get('page');
    const searchParamSortOrder = searchParams.get('sort_order');
    const searchParamSortBy = searchParams.get('sort_by');
    const searchParamQuery = searchParams.get('query');
    const searchParamPageSize = searchParams.get('page_size');

    const pathname = usePathname();
    useEffect(() => {
        setSearchParamPageAction(searchParamPage);
        setSearchParamSortOrderAction(searchParamSortOrder);
        setSearchParamSortByAction(searchParamSortBy);
        setSearchParamQueryAction(searchParamQuery);
        setSearchParamPageSizeAction(searchParamPageSize);
    }, [
        searchParamPage,
        searchParamSortOrder,
        searchParamSortBy,
        searchParamQuery,
        searchParamPageSize
    ]);
    useEffect(() => {
        let basePageData = {
            page: pageData,
            settings: settings
        }
        if (!isObjectEmpty(pageOptions)) {
            basePageData.options = pageOptions;
        }
        loadBasePageData(basePageData);
        // if (isResetKey) {
        //     setPasswordResetKeyAction(params.reset_key)
        //     setSessionUserIdAction(params.user_id)
        // }
    }, [pageData, settings])

    useEffect(() => {
        if (!isObject(page?.pageData)) {
            return;
        }
        if (isObjectEmpty(page.pageData)) {
            return;
        }
        if (app[APP_LOADED]) {
            return;
        }
        if (page?.pageData?.url === pathname) {
            setAppLoadedAction(true);
        }
    }, [page.pageData, pathname])

    return (
        <AppLoader templateConfig={templateConfig()} page={page.pageData} />
    )
}


export default connect(
    (state) => ({
        page: state.page,
        app: state[APP_STATE],
    })
)(FetcherApp);
