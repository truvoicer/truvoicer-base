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

const UserAccountLoaderProvider = (props) => {
    const {session, fields = [], children, dataCallback} = props;

    const [userAccountContextState, setUserAccountContextState] = useState({
        ...userAccountData,
        updateData: ({key, value}) => {
            StateHelpers.updateStateObject({
                key,
                value,
                setStateObj: setUserAccountContextState
            })
        },
        updateNestedObjectData: ({object, key, value}) => {
            StateHelpers.updateStateNestedObjectData({
                object,
                key,
                value,
                setStateObj: setUserAccountContextState
            })
        },
    });
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
        if (!isObject(response?.metaData)) {
            console.error('Invalid user meta data')
            return;
        }
        setUserAccountContextState(prevState => {
            Object.keys(response.metaData).forEach((key) => {
                let cloneState = {...prevState}
                if (userAccountData.hasOwnProperty(key)) {
                    cloneState[key] = response.metaData[key]
                }
                return cloneState
            });
        })
    }
    useEffect(() => {
        if (session[SESSION_AUTHENTICATED] && fields.length) {
            userMetaDataFetchRequest(userDataRequest)
        }
    }, [session[SESSION_AUTHENTICATED]]);

        return (
            <UserAccountDataContext.Provider value={userAccountContextState}>
                {session[SESSION_AUTHENTICATED] &&
                    children
                }
            </UserAccountDataContext.Provider>
        );
};
function mapStateToProps(state) {
    return {
        pageData: state.page.pageData,
        session: state.session
    };
}
UserAccountLoaderProvider.category = 'account';
UserAccountLoaderProvider.templateId = 'userAccountLoaderProvider';
export default connect(
    mapStateToProps,
    null
)(UserAccountLoaderProvider);
