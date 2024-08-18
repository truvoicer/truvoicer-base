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

const WpDataLoaderProvider = (props) => {
    const {session, fields = [], children, dataCallback} = props;

    const userDataRequest = {
        form: {
            type: "single",
            fields: fields
        }
    };

    function getEndpoint(endpoint) {
        switch (endpoint) {
            case 'email':
                return '/forms/email';
            case 'user_meta':
                return '/forms/user/metadata/save';
            case 'account_details':
                return '/users/update';
            case 'user_profile':
                return '/user/profile/update';
            case 'redirect':
                return '/forms/redirect';
            default:
                return null;
        }
    }
    function updateData(data) {
        setUserAccountContextState(prevState => {
            let cloneState = {...prevState}
            let cloneData = {...cloneState.data}
            Object.keys(data).forEach((key) => {
                cloneData[key] = data[key];
            });
            return {...cloneState, data: cloneData}
        })
    }
    async function userMetaDataFetchRequest(reqData) {
        const endpoint = getEndpoint(reqData?.endpoint);
        if (!endpoint) {
            return;
        }
        const response = await protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.formsUserMetaDataRequest),
            reqData,
            false
        )
        if (response?.status !== "success") {
            console.error('Error fetching user meta data')
            return;
        }
        if (!isObject(response?.metaData)) {
            console.error('Invalid user meta data')
            return;
        }
        updateData(response.metaData);
    }

    const [userAccountContextState, setUserAccountContextState] = useState({
        ...wpDataLoaderData,
        updateData: updateData,
        updateNestedObjectData: ({object, key, value}) => {
            StateHelpers.updateStateNestedObjectData({
                object,
                key,
                value,
                setStateObj: setUserAccountContextState
            })
        },
        requestFields: userMetaDataFetchRequest
    });
    useEffect(() => {
        if (session[SESSION_AUTHENTICATED] && fields.length) {
            userMetaDataFetchRequest(userDataRequest)
        }
    }, [session[SESSION_AUTHENTICATED]]);

        return (
            <WpDataLoaderDataContext.Provider value={userAccountContextState}>
                {session[SESSION_AUTHENTICATED] &&
                    children
                }
            </WpDataLoaderDataContext.Provider>
        );
};
function mapStateToProps(state) {
    return {
        pageData: state.page.pageData,
        session: state.session
    };
}
WpDataLoaderProvider.category = 'account';
WpDataLoaderProvider.templateId = 'userAccountLoaderProvider';
export default connect(
    mapStateToProps,
    null
)(WpDataLoaderProvider);
