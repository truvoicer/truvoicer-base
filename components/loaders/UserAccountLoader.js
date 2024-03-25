import React, {useContext, useEffect} from 'react';
import {SESSION_AUTHENTICATED} from "../../redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {connect} from "react-redux";
import {isObject} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const UserAccountLoader = (props) => {
    const {session, fields = [], children, dataCallback} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const userDataRequest = {
        form: {
            type: "single",
            fields: fields
        }
    };
    async function userMetaDataFetchRequest(reqData) {
        const response = await protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.formsUserMetaDataRequest),
            reqData,
            false
        )
        if (response?.status !== "success") {
            console.error('Error fetching user meta data')
            return;
        }
        if (!isObject(response?.data?.metaData)) {
            console.error('Invalid user meta data')
            return;
        }
        dataCallback(response.data.metaData)
    }
    useEffect(() => {
        if (session[SESSION_AUTHENTICATED] && fields.length && typeof dataCallback === 'function') {
            userMetaDataFetchRequest(userDataRequest)
        }
    }, [session[SESSION_AUTHENTICATED]]);
    function defaultView() {
        return (
            <>
                {session[SESSION_AUTHENTICATED] &&
                    children
                }
            </>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'account',
        templateId: 'userAccountLoader',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            userDataRequest: userDataRequest,
            userMetaDataFetchRequest: userMetaDataFetchRequest,
            ...props
        }
    });
};
function mapStateToProps(state) {
    return {
        pageData: state.page.pageData,
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(UserAccountLoader);
