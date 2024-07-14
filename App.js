'use client';
import React, {useEffect} from "react";
import {
    setPasswordResetKeyAction,
    setSessionUserIdAction,
} from "@/truvoicer-base/redux/actions/session-actions";
import {isObject, isObjectEmpty} from "@/truvoicer-base/library/utils";
import AppLoader from "@/truvoicer-base/AppLoader";
import {templateConfig} from "@/config/template-config";
import {loadBasePageData} from "@/truvoicer-base/redux/actions/page-actions";
import {connect} from "react-redux";
import {APP_LOADED, APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";
import {setAppLoadedAction} from "@/truvoicer-base/redux/actions/app-actions";
import {setAppRequestedRoute} from "@/truvoicer-base/redux/reducers/app-reducer";
import {usePathname} from "next/navigation";

const FetcherApp = ({
    app, page, pageData, settings, pageOptions = {}, isResetKey = false
}) => {

    const pathname = usePathname();
    useEffect(() => {
        let basePageData = {
            page: pageData,
            settings: settings
        }
        if (!isObjectEmpty(pageOptions)) {
            basePageData.options = pageOptions;
        }
        loadBasePageData(basePageData);
        console.log('FetcherApp', pageData, settings, pageOptions, isResetKey)
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
        console.log('FetcherApp', page.pageData, pathname)

        // setAppRequestedRoute(item?.post_url);
    }, [page.pageData, pathname])

    return (
        <AppLoader templateConfig={templateConfig()} page={page} />
    )
}


export default connect(
    (state) => ({
        page: state.page,
        app: state[APP_STATE],
    })
)(FetcherApp);
