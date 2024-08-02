import React, {useContext} from "react";
import Header from "@/truvoicer-base/components/layout/Header";
import Footer from "@/truvoicer-base/components/layout/Footer";
import {connect} from "react-redux";
import {filterHtml} from "@/truvoicer-base/library/html-parser";
import parse from 'html-react-parser';
import HtmlHead from "@/truvoicer-base/components/layout/HtmlHead";
import Loader from "@/truvoicer-base/components/loaders/Loader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Sidebar from "@/truvoicer-base/components/Sidebars/Sidebar";
import {siteConfig} from "@/config/site-config";
import {APP_LOADED, APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const SidebarTemplate = (props) => {
    const {modal, pageData, pageOptions, app} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const sidebar = pageData?.page_options?.trf_gut_pmf_page_options_sidebar;
    console.log('pageData', pageData);
    const topSidebar = templateManager.getHorizontalSidebarName(pageData, 'top');
    const bottomSidebar = templateManager.getHorizontalSidebarName(pageData, 'bottom');
    const leftSidebar = templateManager.getHorizontalSidebarName(pageData, 'left');
    const rightSidebar = templateManager.getHorizontalSidebarName(pageData, 'right');

    console.log({topSidebar, bottomSidebar, leftSidebar, rightSidebar});
    return (
        <div className={'body-inner'}>
            <div id={"public_area"}>
                {templateManager.render(
                    <Header
                        showSidebar={true}
                        sidebarName={(isNotEmpty(topSidebar))? topSidebar : siteConfig.navBarName}
                    />
                )}

                { pageData?.post_content && parse(pageData.post_content, {
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
                                    {(isNotEmpty(leftSidebar)) &&
                                        <div className="col-12 col-sm-9 col-md-4 col-lg-4 d-none d-lg-block">
                                            {app[APP_LOADED] && templateManager.render(
                                                <Sidebar name={leftSidebar}/>
                                            )}
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
                                    {(isNotEmpty(rightSidebar)) &&
                                        <div className="col-12 col-sm-9 col-md-6 col-lg-4 d-none d-lg-block">
                                            {app[APP_LOADED] && templateManager.render(
                                                <Sidebar name={rightSidebar}/>
                                            )}
                                        </div>
                                    }
                                </>
                                :
                                templateManager.render(<Loader></Loader>)
                            }
                        </div>
                    </div>
                </section>
                {app[APP_LOADED] && pageData?.post_content && parse(pageData.post_content, {
                    replace: (node, index) => {
                        return filterHtml(
                            node,
                            index,
                            (data) => (data?.sidebar_layout_position === 'outside_bottom')
                        )
                    }
                })}
                {(isNotEmpty(bottomSidebar)) &&
                    <div className="col-12 col-sm-9 col-md-4 col-lg-4 d-none d-lg-block">
                        {app[APP_LOADED] && templateManager.render(
                            <Sidebar name={bottomSidebar}/>
                        )}
                    </div>
                }
                {templateManager.render(<Footer/>)}
            </div>
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
