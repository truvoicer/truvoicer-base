import React, {useEffect, useState} from 'react';
import Header from "../../../views/Layout/Header";
import HtmlHead from "./HtmlHead";
import ReactHtmlParser from "react-html-parser";
import LoaderComponent from "../widgets/Loader";
import Footer from "../../../views/Layout/Footer";
import {connect} from "react-redux";
import {filterHtml} from "../../library/html-parser";
import AccountAreaSidebar from "../../../views/Components/Sidebars/AccountAreaSidebar";
import {
    SESSION_AUTHENTICATED,
    SESSION_IS_AUTHENTICATING,
    SESSION_USER,
    SESSION_USER_TOKEN
} from "../../redux/constants/session-constants";
import {isNotEmpty} from "../../library/utils";
import LoginBlock from "../forms/Auth/LoginBlock";

const htmlParserOptions = {
    decodeEntities: true,
    transform: filterHtml
}
const AccountArea = ({pageData, session}) => {
    const [loadKey, setLoadKey] = useState("show_loader")

    const getAccountArea = () => {
        return (
            <>
                <HtmlHead/>
                <div className={"container-fluid"}>
                    <div className={"row"}>
                        <div className="col-12 col-md-3 col-lg-2 d-none d-md-block left-sidebar pl-0 pr-0">
                            <AccountAreaSidebar/>
                        </div>
                        <div className="col-12 col-md-9 col-lg-10">
                            <div className={"listings-block job_lists mt-0"}>
                                {ReactHtmlParser(pageData.content, htmlParserOptions)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const loadAccountArea = (loadKey) => {
        switch (loadKey) {
            case "show_loader":
                return <LoaderComponent />
            case "show_account_area":
                return getAccountArea()
            case "show_login":
            default:
                return <LoginBlock />
        }

    }

    useEffect(() => {
        if (session[SESSION_IS_AUTHENTICATING]) {
            setLoadKey("show_loader")
        } else if (!isNotEmpty(session[SESSION_USER][SESSION_USER_TOKEN]) || !session[SESSION_AUTHENTICATED]) {
            setLoadKey("show_login")
        } else if (!session[SESSION_IS_AUTHENTICATING] && session[SESSION_AUTHENTICATED] && pageData) {
            console.log("acc")
            setLoadKey("show_account_area")
        } else {
            setLoadKey("show_loader")
        }
    }, [session[SESSION_IS_AUTHENTICATING],session[SESSION_AUTHENTICATED], session[SESSION_USER][SESSION_USER_TOKEN]])

    return (
        <div id={"account_area"}>
            <>
                <Header/>
                {loadAccountArea(loadKey)}
                <Footer/>
            </>
        </div>
    );
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
