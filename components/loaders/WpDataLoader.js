import React, {useContext, useEffect, useState} from 'react';
import {SESSION_AUTHENTICATED} from "../../redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {connect} from "react-redux";
import {isObject} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {StateHelpers} from "@/truvoicer-base/library/helpers/state-helpers";
import WpDataLoaderDataContext, {wpDataLoaderData} from "@/truvoicer-base/components/loaders/contexts/WpDataLoaderDataContext";
import WpDataLoaderProvider from "@/truvoicer-base/components/loaders/WpDataLoaderProvider";

const WpDataLoader = (props) => {
    const {fields = [], children} = props;
        return (
            <WpDataLoaderProvider fields={fields}>
                {children}
            </WpDataLoaderProvider>
        );
};
function mapStateToProps(state) {
    return {
        pageData: state.page.pageData,
        session: state.session
    };
}
WpDataLoader.category = 'account';
WpDataLoader.templateId = 'userAccountLoader';
export default connect(
    mapStateToProps,
    null
)(WpDataLoader);
