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

    return (
        <>
        <Script id={'google_client_script'} async={true} src="https://accounts.google.com/gsi/client" />
        <Script id={'fb_sdk_script'} async={true} src="https://connect.facebook.net/en_US/sdk.js" />
        <Script id={'pinterest_sdk_script'}>
            {` (function (d) {
            var f = d.getElementsByTagName('SCRIPT')[0],
              p = d.createElement('SCRIPT');
            p.type = 'text/javascript';
            p.async = true;
            p.src = '//assets.pinterest.com/js/pinit.js';
            f.parentNode.insertBefore(p, f);
          })(document);`}
        </Script>
            <Script id={'twitter_sdk_script'}>
                {`window.twttr = (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0],
                    t = window.twttr || {};
                    if (d.getElementById(id)) return t;
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "https://platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js, fjs);

                    t._e = [];
                    t.ready = function(f) {
                    t._e.push(f);
                };

                    return t;
                }(document, "script", "twitter-wjs"));`}
            </Script>
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
