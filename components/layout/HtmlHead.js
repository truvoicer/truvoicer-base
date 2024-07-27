import React, {useContext} from 'react';
import Head from "next/head";
import {isNotEmpty} from "../../library/utils";
import {getHeadScripts} from "../../library/helpers/pages";
import {connect} from "react-redux";
import Script from "next/script";

function HtmlHead({siteSettings, pageData, page}) {

    const headScripts = getHeadScripts(pageData?.page_options, siteSettings);
    return (
        <>
            <Head>
                {isNotEmpty(headScripts) &&
                    <Script id={'header_scripts'}>
                        {headScripts}
                    </Script>
                }
            </Head>
        </>
    );
}

HtmlHead.category = 'layout';
HtmlHead.templateId = 'htmlHead';

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
