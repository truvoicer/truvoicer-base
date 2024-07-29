import React, {useContext, useEffect, useState} from 'react';
import HtmlHead from "./HtmlHead";
import parse from 'html-react-parser';
import LoaderComponent from "../loaders/Loader";
import {connect} from "react-redux";
import {filterHtml} from "../../library/html-parser";
import AccountAreaSidebar from "@/truvoicer-base/components/Sidebars/AccountAreaSidebar";
import {
    SESSION_AUTHENTICATED,
    SESSION_IS_AUTHENTICATING,
    SESSION_USER,
    SESSION_USER_TOKEN
} from "../../redux/constants/session-constants";
import {isNotEmpty} from "../../library/utils";
import LoginBlock from "../forms/Auth/LoginBlock";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import Footer from "@/truvoicer-base/components/layout/Footer";
import Header from "@/truvoicer-base/components/layout/Header";
import {APP_LOADED, APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";
import Sidebar from "@/truvoicer-base/components/Sidebars/Sidebar";
import {siteConfig} from "@/config/site-config";

const AccountArea = (props) => {
    const {pageData, session, app} = props;
    const [loadKey, setLoadKey] = useState("show_loader")

    const templateContext = useContext(TemplateContext);
    const templateManager = new TemplateManager(templateContext);

    const htmlParserOptions = {
        decodeEntities: true,
        replace: (node, index) => {
            return filterHtml(node, index)
        }
    }

    useEffect(() => {
        if (session[SESSION_IS_AUTHENTICATING]) {
            setLoadKey("show_loader")
        } else if (!isNotEmpty(session[SESSION_USER][SESSION_USER_TOKEN]) || !session[SESSION_AUTHENTICATED]) {
            setLoadKey("show_login")
        } else if (!session[SESSION_IS_AUTHENTICATING] && session[SESSION_AUTHENTICATED] && pageData) {
            setLoadKey("show_account_area")
        } else {
            setLoadKey("show_loader")
        }
    }, [session[SESSION_IS_AUTHENTICATING], session[SESSION_AUTHENTICATED], session[SESSION_USER][SESSION_USER_TOKEN]])


    return (
        <section className="block-wrapper">
            {templateManager.render(<HtmlHead/>)}
            {templateManager.render(<Header/>)}
            {loadKey === 'show_loader' &&
                templateManager.render(<LoaderComponent/>)
            }
            {loadKey === 'show_login' &&
                templateManager.render(<LoginBlock/>)
            }
            {loadKey === 'show_account_area' && (
                <>
                    {templateManager.hasSidebar(pageData)
                        ? (
                            <>
                                {app[APP_LOADED] && pageData?.post_content && parse(pageData.post_content, {
                                    replace: (node, index) => {
                                        return filterHtml(
                                            node,
                                            index,
                                            (data) => (data?.sidebar_layout_position === 'outside_top')
                                        )
                                    }
                                })}
                                <div className="container">
                                    <div className="row">
                                        <div className="col-12 col-sm-9 col-md-4 col-lg-4 d-none d-lg-block">
                                            {app[APP_LOADED] && templateManager.render(
                                                <Sidebar name={siteConfig.accountAreaSidebarName}/>
                                            )}
                                        </div>
                                        <div className="col-12 col-lg-8">
                                            <div className="account-content">
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
                                        </div>
                                    </div>
                                </div>
                                {app[APP_LOADED] && pageData?.post_content && parse(pageData.post_content, {
                                    replace: (node, index) => {
                                        return filterHtml(
                                            node,
                                            index,
                                            (data) => (data?.sidebar_layout_position === 'outside_bottom')
                                        )
                                    }
                                })}
                            </>
                        )
                        : (
                            <div className="account-content">
                                {app[APP_LOADED] && pageData?.post_content && parse(pageData.post_content, htmlParserOptions)}
                            </div>
                        )
                    }
                </>
            )}

            {templateManager.render(<Footer fluidContainer={true}/>)}
        </section>
    );
};

function mapStateToProps(state) {
    return {
        pageData: state.page.pageData,
        session: state.session,
        app: state[APP_STATE]
    };
}

AccountArea.category = 'layout';
AccountArea.templateId = 'accountArea';
export default connect(
    mapStateToProps,
    null
)(AccountArea);
