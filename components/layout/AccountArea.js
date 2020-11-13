import React from 'react';
import Header from "../../../views/Layout/Header";
import HtmlHead from "./HtmlHead";
import ReactHtmlParser from "react-html-parser";
import LoaderComponent from "../widgets/Loader";
import Footer from "../../../views/Layout/Footer";
import {connect} from "react-redux";
import {filterHtml} from "../../library/html-parser";
import LeftSidebar from "../../../views/Components/Sidebars/LeftSidebar";
import AccountAreaSidebar from "../../../views/Components/Sidebars/AccountAreaSidebar";

const htmlParserOptions = {
    decodeEntities: true,
    transform: filterHtml
}
const AccountArea = ({pageData}) => {
    return (
        <div id={"account_area"}>
            <>
                <Header/>
                {pageData
                    ?
                    <>
                        <HtmlHead/>
                        <div className={"row"}>
                            <div className="col-12 col-sm-9 col-md-3 col-lg-2 d-none d-md-block">
                                <AccountAreaSidebar/>
                            </div>
                            <div className="col-12 col-md-10 col-lg-10">
                                <div className={"listings-block job_lists mt-0"}>
                                    {ReactHtmlParser(pageData.content, htmlParserOptions)}
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
    };
}

export default connect(
    mapStateToProps,
    null
)(AccountArea);
