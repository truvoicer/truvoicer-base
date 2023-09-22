import {
    AddAxiosInterceptors,
    initializeTagManager,
    LoadEnvironment,
    tagManagerSendDataLayer
} from "@/truvoicer-base/library/api/global-scripts"
import React, {useEffect, useState} from "react";
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
import {listingsTemplateData} from "@/truvoicer-base/library/listings/contexts/ListingsTemplateContext";
import {AppContext, appContextData} from "@/truvoicer-base/config/contexts/AppContext";
import {updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";

const htmlParserOptions = {
    decodeEntities: true,
    transform: filterHtml
}
const FetcherApp = ({modal, pageData, pageOptions, siteSettings}) => {
    const router = useRouter();

    const [appContextState, setAppContextState] = useState({
        ...appContextData,
        ...{
            addContext: ({key, value}) => {
                updateStateObject({
                    key,
                    value,
                    setStateObj: setAppContextState
                })
            },
            updateContext: (value) => {
                updateStateObject({
                    key: 'context',
                    value,
                    setStateObj: setAppContextState
                })
            },
        }
    })

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
        <AppContext.Provider value={appContextState}>
            {pageOptions?.pageType === "user_account"
                ?
                <AccountArea data={pageData}/>
                :
                <div id={"public_area"}>
                    <Header/>
                    <>
                        {pageData
                            ?
                            <>
                                <HtmlHead />
                                {ReactHtmlParser(pageData.post_content, htmlParserOptions)}
                            </>
                            :
                            <></>
                        }
                    </>
                    <Footer/>
                </div>
            }
            {getModal()}
        </AppContext.Provider>
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
