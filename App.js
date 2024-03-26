'use client';
import React, {useEffect} from "react";
import {
    setPasswordResetKeyAction,
    setSessionUserIdAction,
} from "@/truvoicer-base/redux/actions/session-actions";
import {connect} from "react-redux";
import {isObjectEmpty} from "@/truvoicer-base/library/utils";
import AppLoader from "@/truvoicer-base/AppLoader";
import {templateConfig} from "@/config/template-config";
import {loadBasePageData} from "@/truvoicer-base/redux/actions/page-actions";

const FetcherApp = ({
    page, settings, pageOptions = {}, isResetKey = false
}) => {

    useEffect(() => {
        let basePageData = {
            page: page,
            settings: settings
        }
        if (!isObjectEmpty(pageOptions)) {
            basePageData.options = pageOptions;
        }
        loadBasePageData(basePageData);

        if (isResetKey) {
            setPasswordResetKeyAction(params.reset_key)
            setSessionUserIdAction(params.user_id)
        }
    }, [])

    return (
        <AppLoader templateConfig={templateConfig()} page={page} />
    )
}


export default connect(
    null,
    null
)(FetcherApp);
