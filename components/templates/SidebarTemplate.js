import React, {useContext} from "react";
import Header from "@/truvoicer-base/components/layout/Header";
import Footer from "@/truvoicer-base/components/layout/Footer";
import {connect} from "react-redux";
import {filterHtml} from "@/truvoicer-base/library/html-parser";
import parse from 'html-react-parser';
import AccountArea from "@/truvoicer-base/components/layout/AccountArea";
import HtmlHead from "@/truvoicer-base/components/layout/HtmlHead";
import Loader from "@/truvoicer-base/components/loaders/Loader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Sidebar from "@/truvoicer-base/components/Sidebars/Sidebar";
import {siteConfig} from "@/config/site-config";
import {APP_LOADED, APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";

const SidebarTemplate = (props) => {
    const {modal, pageData, pageOptions, app} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    return (
        <div className={'body-inner'}>
            {pageOptions?.pageType === "user_account"
                ?
                templateManager.render(<AccountArea data={pageData}/>)
                :
                <div id={"public_area"}>
                    {templateManager.render(<Header/>)}

                    {app[APP_LOADED] && pageData?.post_content && parse(pageData.post_content, {
                        replace: (node, index) => {
                            return filterHtml(
                                node,
                                index,
                                (data) => (data?.sidebar_layout_position === 'outside_top')
                            )
                        }
                    })}
                    <section className="block-wrapper">
                        <div className="container">
                            <div className="row">
                                {pageData
                                    ?
                                    <>
                                        {templateManager.render(<HtmlHead/>)}
                                        {templateManager.isSidebar(pageData, 'left-sidebar') &&
                                            <div className="col-12 col-sm-9 col-md-4 col-lg-4 d-none d-lg-block">
                                                {templateManager.render(<Sidebar name={siteConfig.leftSidebarName}/>)}
                                            </div>
                                        }
                                        <div className="col-12 col-lg-8">
                                            {app[APP_LOADED] && pageData?.post_content && parse(pageData.post_content, {
                                                replace: (node, index) => {
                                                    return filterHtml(
                                                        node,
                                                        index,
                                                        (data) => {
                                                            switch (data?.sidebar_layout_position) {
                                                                case 'outside_top':
                                                                case 'outside_bottom':
                                                                    return false;
                                                                default:
                                                                    return true;
                                                            }
                                                        }
                                                    )
                                                }
                                            })}
                                        </div>
                                        {templateManager.isSidebar(pageData, 'right-sidebar') &&
                                            <div className="col-12 col-sm-9 col-md-6 col-lg-4 d-none d-lg-block">
                                                {templateManager.render(<Sidebar name={siteConfig.rightSidebarName}/>)}
                                            </div>
                                        }
                                    </>
                                    :
                                    templateManager.render(<Loader></Loader>)
                                }
                            </div>
                        </div>
                    </section>
                    {pageData?.post_content && parse(pageData.post_content, {
                        replace: (node, index) => {
                            return filterHtml(
                                node,
                                index,
                                (data) => (data?.sidebar_layout_position === 'outside_bottom')
                            )
                        }
                    })}
                    {templateManager.render(<Footer/>)}
                </div>
            }

        </div>
    );
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
        pageOptions: state.page.pageDataOptions,
        modal: state.page.modal,
        app: state[APP_STATE]
    };
}

SidebarTemplate.category = 'templates';
SidebarTemplate.templateId = 'sidebarTemplate';
export default connect(
    mapStateToProps,
    null
)(SidebarTemplate);
