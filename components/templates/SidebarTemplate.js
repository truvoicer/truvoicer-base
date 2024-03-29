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
import LeftSidebar from "@/truvoicer-base/components/Sidebars/LeftSidebar";
import RightSidebar from "@/truvoicer-base/components/Sidebars/RightSidebar";

const SidebarTemplate = (props) => {
    const {modal, pageData, pageOptions} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const htmlParserOptions = {
        replace: (node, index) => {
            return filterHtml(node, index)
        }
    }
    console.log('sidebarTemplate', pageData)

        return (
            <>
                {pageOptions?.pageType === "user_account"
                    ?
                    templateManager.render(<AccountArea data={pageData}/>)
                    :
                    <div id={"public_area"}>
                        {templateManager.render(<Header/>)}
                        <>
                            {pageData
                                ?
                                <>
                                    {templateManager.render(<HtmlHead/>)}
                                    <div className={"row"}>
                                        {templateManager.isTemplateLayout(pageData, 'left-sidebar') &&
                                            <div className="col-12 col-sm-9 col-md-4 col-lg-2 d-none d-lg-block">
                                                {templateManager.render(<LeftSidebar/>)}
                                            </div>
                                        }
                                        <div className="col-12 col-lg-10">
                                            {parse(pageData.post_content, htmlParserOptions)}
                                        </div>
                                        {templateManager.isTemplateLayout(pageData, 'right-sidebar') &&
                                            <div className="col-12 col-sm-9 col-md-6 col-lg-3 d-none d-lg-block">
                                                {templateManager.render(<RightSidebar/>)}
                                            </div>
                                        }
                                    </div>
                                </>
                                :
                                templateManager.render(<Loader></Loader>)
                            }
                        </>
                        {templateManager.render(<Footer/>)}
                    </div>
                }

            </>
        );
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
        pageOptions: state.page.pageDataOptions,
        modal: state.page.modal
    };
}
SidebarTemplate.category = 'templates';
SidebarTemplate.templateId = 'sidebarTemplate';
export default connect(
    mapStateToProps,
    null
)(SidebarTemplate);
