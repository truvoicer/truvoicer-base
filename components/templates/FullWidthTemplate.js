import React, {useContext} from "react";
import Header from "@/truvoicer-base/components/layout/Header";
import Footer from "@/truvoicer-base/components/layout/Footer";
import {connect} from "react-redux";
import {isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {getWidget} from "@/truvoicer-base/redux/actions/page-actions";
import PageModal from "@/truvoicer-base/components/modals/PageModal";
import {filterHtml} from "@/truvoicer-base/library/html-parser";
import ReactHtmlParser from "react-html-parser";
import AccountArea from "@/truvoicer-base/components/layout/AccountArea";
import HtmlHead from "@/truvoicer-base/components/layout/HtmlHead";
import Loader from "@/truvoicer-base/components/loaders/Loader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const FullWidthTemplate = (props) => {
    const {modal, pageData, pageOptions} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const htmlParserOptions = {
        decodeEntities: true,
        transform: (node, index) => {
            return filterHtml(node, index)
        }
    }

    console.log('fwt tb')
    const getModal = () => {
        if (isSet(modal.component) && !isObjectEmpty(modal.component) && modal.show) {
            return (
                <PageModal show={modal.show}>
                    {getWidget(modal.component, modal.data)}
                </PageModal>
            )
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
                                    {ReactHtmlParser(pageData.post_content, htmlParserOptions)}
                                </>
                                :
                                <Loader></Loader>
                            }
                        </>
                        <Footer/>
                    </div>
                }
                {getModal()}
            </>
        )
    }

    return templateManager.getTemplateComponent({
        category: 'templates',
        templateId: 'fullWidthTemplate',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            htmlParserOptions,
            getModal,
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
)(FullWidthTemplate);
