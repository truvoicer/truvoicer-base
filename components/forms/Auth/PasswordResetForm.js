import React, {useState} from 'react';
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "../../../redux/middleware/session-middleware";
import {buildWpApiUrl, publicApiRequest} from "../../../library/api/wp/middleware";
import DataForm from "../DataForm/DataForm";
import {wpApiConfig} from "../../../config/wp-api-config";
import {PasswordResetRequestData} from "../../../config/forms/password-reset-request-form";


const PasswordResetForm = (props) => {
    const [submitButtonText, setSubmitButtonText] = useState("Request Password Reset",);

    const submitHandler = (values) => {
        publicApiRequest(buildWpApiUrl(wpApiConfig.endpoints.passwordReset), values, props.requestCallback)
    }

    return (
        <>
            {!props.session.authenticated &&
            <>
                <DataForm
                    data={PasswordResetRequestData}
                    submitCallback={submitHandler}
                    submitButtonText={submitButtonText}
                >
                    {props.children}
                </DataForm>
            </>
            }
        </>
    );
}

function mapStateToProps(state) {
    // console.log(state.session)
    return {
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    {getSessionTokenMiddleware}
)(PasswordResetForm);
