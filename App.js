import {
    AddAxiosInterceptors,
    initializeTagManager,
    LoadEnvironment,
    tagManagerSendDataLayer
} from "@/truvoicer-base/library/api/global-scripts"
import React, {useContext, useEffect} from "react";
import {validateToken} from "@/truvoicer-base/redux/actions/session-actions";
import {connect} from "react-redux";
import {isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {useRouter} from "next/router";
import {TemplateContext, templateData} from "@/truvoicer-base/config/contexts/TemplateContext";
import AppLoader from "@/truvoicer-base/AppLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {templateConfig} from "@/config/template-config";

const FetcherApp = ({modal, pageData, pageOptions, siteSettings}) => {
    const router = useRouter();
    const templateContext = useContext(TemplateContext);
    const templateManager = new TemplateManager(templateContext);
    useEffect(() => {
        AddAxiosInterceptors();
        LoadEnvironment();
        validateToken();
    }, [])

    useEffect(() => {
        if (!isObjectEmpty(pageData)) {
            // tagManagerSendDataLayer({
            //     dataLayerName: "pageView",
            //     dataLayer: {
            //         page: router.asPath
            //     }
            // })

        }
    }, [router.asPath])

    console.log({pageOptions, pageData})
    return (
        <AppLoader templateConfig={templateConfig()}>
            {templateManager.getPostTemplateLayoutComponent(pageData)}
        </AppLoader>
    )
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
        pageOptions: state.page.pageDataOptions,
        modal: state.page.modal
    };
}

export default connect(
    mapStateToProps,
    null
)(FetcherApp);
