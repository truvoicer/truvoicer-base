import React, {useContext, useEffect, useState} from 'react';
import {SESSION_AUTHENTICATED} from "../../redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {connect} from "react-redux";
import {isObject} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {StateHelpers} from "@/truvoicer-base/library/helpers/state-helpers";
import UserAccountDataContext, {userAccountData} from "@/truvoicer-base/components/loaders/contexts/UserAccountDataContext";
import UserAccountLoaderProvider from "@/truvoicer-base/components/loaders/UserAccountProvider";

const UserAccountLoader = (props) => {
    const {fields = [], children} = props;
        return (
            <UserAccountLoaderProvider fields={fields}>
                {children}
            </UserAccountLoaderProvider>
        );
};
function mapStateToProps(state) {
    return {
        pageData: state.page.pageData,
        session: state.session
    };
}
UserAccountLoader.category = 'account';
UserAccountLoader.templateId = 'userAccountLoader';
export default connect(
    mapStateToProps,
    null
)(UserAccountLoader);
