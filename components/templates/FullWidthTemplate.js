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
import {APP_LOADED, APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";
import {siteConfig} from "@/config/site-config";
import NotificationLoader from "@/truvoicer-base/components/loaders/NotificationLoader";
import {
    NOTIFICATION_POSITION_TOP_CENTER,
    NOTIFICATION_TYPE_CONTENT, NOTIFICATION_TYPE_TOAST
} from "@/truvoicer-base/config/contexts/AppNotificationContext";

const FullWidthTemplate = (props) => {
    const {pageData, pageOptions, app} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const htmlParserOptions = {
        decodeEntities: true,
        replace: (node, index) => {
            return filterHtml(node, index)
        }
    }


    return (
        <div className={'body-inner'}>
            <div id={"public_area"}>
                <NotificationLoader
                    type={NOTIFICATION_TYPE_CONTENT}
                    position={NOTIFICATION_POSITION_TOP_CENTER}
                />
                {app[APP_LOADED] && templateManager.render(<Header showSidebar={true} sidebarName={siteConfig.navBarName}/>)}
                <div className="main-content">
                    {app[APP_LOADED] && typeof pageData?.post_content === "string" && pageData
                        ?
                        <>
                            {templateManager.render(<HtmlHead/>)}
                            {pageData?.post_content && parse(pageData.post_content, htmlParserOptions)}
                        </>
                        :
                        templateManager.render(<Loader></Loader>)
                    }
                </div>
                {templateManager.render(<Footer/>)}
            </div>
            <NotificationLoader
                type={NOTIFICATION_TYPE_TOAST}
            />

        </div>
    )
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
        pageOptions: state.page.pageDataOptions,
        app: state[APP_STATE]
    };
}

FullWidthTemplate.category = 'templates';
FullWidthTemplate.templateId = 'fullWidthTemplate';

export default connect(
    mapStateToProps,
    null
)(FullWidthTemplate);
