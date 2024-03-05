import React, {useContext} from 'react';
import Head from "next/head";
import {isNotEmpty} from "../../library/utils";
import {getHeadScripts} from "../../library/helpers/pages";
import {connect} from "react-redux";
import Script from "next/script";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function HtmlHead({siteSettings, pageData, page}) {

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const headScripts = getHeadScripts(pageData?.page_options, siteSettings);
    function defaultView() {
    return (
        <>
        <Script id={'google_client_script'} src="https://accounts.google.com/gsi/client" />
        <Script id={'fb_sdk_script'} src="https://connect.facebook.net/en_US/sdk.js" />
            <Head>
                <title>{pageData.seo_title ? pageData.seo_title : "Loading..."}</title>
                {isNotEmpty(headScripts) &&
                    <Script id={'header_scripts'}>
                        {headScripts}
                    </Script>
                }
            </Head>
        </>
    );
    }

    return templateManager.getTemplateComponent({
        category: 'layout',
        templateId: 'htmlHead',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            headScripts: headScripts
        }
    })
}

function mapStateToProps(state) {
    return {
        page: state.page,
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
    };
}

export default connect(
    mapStateToProps,
    null
)(HtmlHead);
