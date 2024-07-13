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

const FetcherApp = ({
    app, page, pageData, settings, pageOptions = {}, isResetKey = false
}) => {

    useEffect(() => {
        let basePageData = {
            page: pageData,
            settings: settings
        }
        if (!isObjectEmpty(pageOptions)) {
            basePageData.options = pageOptions;
        }
        loadBasePageData(basePageData);
        console.log('FetcherApp', page, settings, pageOptions, isResetKey)
        // if (isResetKey) {
        //     setPasswordResetKeyAction(params.reset_key)
        //     setSessionUserIdAction(params.user_id)
        // }
    }, [])

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
        setAppLoadedAction(true);
    }, [page.pageData])

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
