import React, {useContext, useEffect, useState} from 'react';
import Header from "../../../views/Layout/Header";
import HtmlHead from "./HtmlHead";
import parse from 'html-react-parser';
import LoaderComponent from "../loaders/Loader";
import Footer from "../../../views/Layout/Footer";
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

const AccountArea = (props) => {
    const {pageData, session} = props;
    const [loadKey, setLoadKey] = useState("show_loader")

    const templateContext = useContext(TemplateContext);
    const templateManager = new TemplateManager(templateContext);

    const htmlParserOptions = {
        decodeEntities: true,
        transform: (node, index) => {
            return filterHtml(node, index)
        }
    }
    const getAccountArea = () => {
        return (
            <>
                <HtmlHead />
                <div className={"container-fluid"}>
                    <div className={"d-flex"}>
                        <div className="d-none d-md-block left-sidebar pl-0 pr-0">
                            <AccountAreaSidebar />
                        </div>
                        <div className="account-content">
                            {parse(pageData.content, htmlParserOptions)}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const loadAccountArea = (loadKey) => {
        switch (loadKey) {
            case "show_loader":
                return <LoaderComponent />;
            case "show_account_area":
                return getAccountArea();
            case "show_login":
            default:
                return <LoginBlock />;
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
    }, [session[SESSION_IS_AUTHENTICATING],session[SESSION_AUTHENTICATED], session[SESSION_USER][SESSION_USER_TOKEN]])

    function defaultView() {
    return (
        <div id={"account_area"}>
            <>
                <Header />
                {loadAccountArea(loadKey)}
                <Footer fluidContainer={true} />
            </>
        </div>
    );
    }
    return templateManager.getTemplateComponent({
        category: 'layout',
        templateId: 'accountArea',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            loadAccountArea: loadAccountArea,
            loadKey: loadKey,
            setLoadKey: setLoadKey,
            getAccountArea: getAccountArea,
            htmlParserOptions: htmlParserOptions,
            ...props
        }
    })
};

function mapStateToProps(state) {
    // console.log(state.page.modal)
    return {
        pageData: state.page.pageData,
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(AccountArea);
