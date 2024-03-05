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
import LeftSidebar from "@/truvoicer-base/components/Sidebars/LeftSidebar";
import RightSidebar from "@/truvoicer-base/components/Sidebars/RightSidebar";

const SidebarTemplate = (props) => {
    const {modal, pageData, pageOptions} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const htmlParserOptions = {
        decodeEntities: true,
        transform: (node, index) => {
            return filterHtml(node, index)
        }
    }

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
                                    <div className={"row"}>
                                        {templateManager.isTemplateLayout(pageData, 'left-sidebar') &&
                                            <div className="col-12 col-sm-9 col-md-4 col-lg-2 d-none d-lg-block">
                                                <LeftSidebar/>
                                            </div>
                                        }
                                        <div className="col-12 col-lg-10">
                                            {ReactHtmlParser(pageData.post_content, htmlParserOptions)}
                                        </div>
                                        {templateManager.isTemplateLayout(pageData, 'right-sidebar') &&
                                            <div className="col-12 col-sm-9 col-md-6 col-lg-3 d-none d-lg-block">
                                                <RightSidebar />
                                            </div>
                                        }
                                    </div>
                                </>
                                :
                                <Loader></Loader>
                            }
                        </>
                        <Footer/>
                    </div>
                }

            </>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'templates',
        templateId: 'sidebarTemplate',
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
        modal: state.page.modal
    };
}

export default connect(
    mapStateToProps,
    null
)(SidebarTemplate);
