import React from 'react';
import Head from "next/head";
import {isNotEmpty} from "../../library/utils";
import {getHeadScripts} from "../../library/helpers/pages";
import {connect} from "react-redux";
import Script from "next/script";

function HtmlHead({siteSettings, pageData}) {

    const headScripts = getHeadScripts(pageData?.page_options, siteSettings);
    return (
        <Head>
            <title>{pageData.seo_title ? pageData.seo_title : "Loading..."}</title>
            {isNotEmpty(headScripts) &&
                <Script>
                    {headScripts}
                </Script>
            }
        </Head>
    );
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
    };
}

export default connect(
    mapStateToProps,
    null
)(HtmlHead);
