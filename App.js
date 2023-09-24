import {
    AddAxiosInterceptors,
    initializeTagManager,
    LoadEnvironment,
    tagManagerSendDataLayer
} from "@/truvoicer-base/library/api/global-scripts"
import React, {useContext, useEffect, useState} from "react";
import Header from "../views/Layout/Header";
import Footer from "../views/Layout/Footer";
import {validateToken} from "@/truvoicer-base/redux/actions/session-actions";
import {connect} from "react-redux";
import {isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {getWidget} from "@/truvoicer-base/redux/actions/page-actions";
import PageModal from "./components/modals/PageModal";
import {filterHtml} from "@/truvoicer-base/library/html-parser";
import ReactHtmlParser from "react-html-parser";
import AccountArea from "./components/layout/AccountArea";
import HtmlHead from "./components/layout/HtmlHead";
import {useRouter} from "next/router";
import {TemplateContext, templateData} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppContext, appContextData} from "@/truvoicer-base/config/contexts/AppContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import AppLoader from "@/truvoicer-base/AppLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import AccountAreaSidebar from "@/truvoicer-base/components/Sidebars/AccountAreaSidebar";

const FetcherApp = ({modal, pageData, pageOptions, siteSettings, templateConfig = {}}) => {
    const router = useRouter();
    const templateContext = useContext(TemplateContext);
    const templateManager = new TemplateManager(templateContext);
    const htmlParserOptions = {
        decodeEntities: true,
        transform: (node, index) => {
            return filterHtml(node, index)
        }
    }
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

    const getModal = () => {
        if (isSet(modal.component) && !isObjectEmpty(modal.component) && modal.show) {
            return (
                <PageModal show={modal.show}>
                    {getWidget(modal.component, modal.data)}
                </PageModal>
            )
        }
    }
    console.log({pageOptions, pageData})
    return (
        <AppLoader templateConfig={templateConfig}>
            {pageOptions?.pageType === "user_account"
                ?
                <AccountArea data={pageData}/>
                :
                <div id={"public_area"}>
                    {
                        templateManager.getTemplateComponent({
                            category: 'public',
                            templateId: 'header',
                            defaultComponent: <Header />,
                        })
                    }
                    <>
                        {pageData
                            ?
                            <>
                                {
                                    templateManager.getTemplateComponent({
                                        category: 'public',
                                        templateId: 'htmlHead',
                                        defaultComponent: <HtmlHead />,
                                    })
                                }
                                {ReactHtmlParser(pageData.post_content, htmlParserOptions)}
                            </>
                            :
                            <></>
                        }
                    </>
                    {
                        templateManager.getTemplateComponent({
                            category: 'public',
                            templateId: 'footer',
                            defaultComponent: <Footer />,
                        })
                    }
                </div>
            }
            {getModal()}
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
