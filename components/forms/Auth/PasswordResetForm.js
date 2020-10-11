import React, {useState} from 'react';
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "../../../redux/middleware/session-middleware";
import {buildWpApiUrl, publicApiRequest} from "../../../library/api/wp/middleware";
import {siteConfig} from "../../../../config/site-config";
import DataForm from "../DataForm";
import {LoginFormData} from "../../../config/forms/login-form";
import {useRouter} from "next/router";
import {wpApiConfig} from "../../../config/wp-api-config";
import {PasswordResetData} from "../../../config/forms/password-reset-form";


const PasswordResetForm = (props) => {
    const [submitButtonText, setSubmitButtonText] = useState("Reset Password",);

    const submitHandler = (values) => {
        publicApiRequest(buildWpApiUrl(wpApiConfig.endpoints.passwordReset), values, props.requestCallback)
    }

    return (
        <>
            {!props.session.authenticated &&
            <>
                <DataForm
                    data={PasswordResetData}
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
