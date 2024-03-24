import React, {useContext} from "react";
import Header from "@/truvoicer-base/components/layout/Header";
import Footer from "@/truvoicer-base/components/layout/Footer";
import {connect} from "react-redux";
import {filterHtml} from "@/truvoicer-base/library/html-parser";
import ReactHtmlParser from "react-html-parser";
import AccountArea from "@/truvoicer-base/components/layout/AccountArea";
import HtmlHead from "@/truvoicer-base/components/layout/HtmlHead";
import Loader from "@/truvoicer-base/components/loaders/Loader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const FullWidthTemplate = (props) => {
    const {pageData, pageOptions} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const htmlParserOptions = {
        decodeEntities: true,
        transform: (node, index) => {
            return filterHtml(node, index)
        }
    }

    console.log('FullWidthTemplate', pageData)
    function defaultView() {
        return (
            <>
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
                                    <HtmlHead/>
                                    {ReactHtmlParser(pageData.post_content, htmlParserOptions)}
                                </>
                                :
                                <Loader></Loader>
                            }
                        </>
                        <Footer/>
                    </div>
                }
            </>
        )
    }

    return templateManager.getTemplateComponent({
        category: 'templates',
        templateId: 'fullWidthTemplate',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            htmlParserOptions,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
        pageOptions: state.page.pageDataOptions,
    };
}

export default connect(
    mapStateToProps,
    null
)(FullWidthTemplate);
