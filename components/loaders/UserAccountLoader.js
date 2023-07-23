import React, {useEffect} from 'react';
import {SESSION_AUTHENTICATED} from "../../redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {connect} from "react-redux";
import {isObject} from "@/truvoicer-base/library/utils";

const UserAccountLoader = ({session, fields = [], children, dataCallback}) => {
    const userDataRequest = {
        form: {
            type: "single",
            fields: fields
        }
    };
    useEffect(() => {
        if (session[SESSION_AUTHENTICATED]) {
            protectedApiRequest(
                buildWpApiUrl(wpApiConfig.endpoints.formsUserMetaDataRequest),
                userDataRequest,
                false
            )
                .then(response => {
                    if (response?.data?.status !== "success") {
                        console.error('Error fetching user meta data')
                        return;
                    }
                    if (!isObject(response?.data?.metaData)) {
                        console.error('Invalid user meta data')
                        return;
                    }
                    dataCallback(response.data.metaData)
                })
                .catch(error => {
                    console.error(error)
                })
        } else {
            dataCallback({})
        }
    }, [session[SESSION_AUTHENTICATED]]);
    return (
        <>
            {session[SESSION_AUTHENTICATED] &&
                children
            }
        </>
    );
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
