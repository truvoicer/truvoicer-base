import React, {useEffect} from 'react';
import Header from "../../../views/Layout/Header";
import HtmlHead from "./HtmlHead";
import ReactHtmlParser from "react-html-parser";
import LoaderComponent from "../widgets/Loader";
import Footer from "../../../views/Layout/Footer";
import {connect} from "react-redux";
import {filterHtml} from "../../library/html-parser";
import LeftSidebar from "../../../views/Components/Sidebars/LeftSidebar";
import AccountAreaSidebar from "../../../views/Components/Sidebars/AccountAreaSidebar";
import {SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING} from "../../redux/constants/session-constants";

const htmlParserOptions = {
    decodeEntities: true,
    transform: filterHtml
}
const AccountArea = ({pageData, session}) => {
    return (
        <div id={"account_area"}>
            <>
                <Header/>
                {!session[SESSION_IS_AUTHENTICATING] && session[SESSION_AUTHENTICATED] && pageData
                    ?
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
                    :
                    <LoaderComponent/>
                }
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
