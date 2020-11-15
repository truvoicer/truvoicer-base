import React, {useState} from 'react';
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "../../../redux/middleware/session-middleware";
import {buildWpApiUrl} from "../../../library/api/wp/middleware";
import {siteConfig} from "../../../../config/site-config";
import DataForm from "../DataForm/DataForm";
import {LoginFormData} from "../../../config/forms/login-form";
import {useRouter} from "next/router";
import {wpApiConfig} from "../../../config/wp-api-config";


const AuthLoginForm = (props) => {
    const [submitButtonText, setSubmitButtonText] = useState("Login");

    const submitHandler = (values) => {
        props.getSessionTokenMiddleware(buildWpApiUrl(wpApiConfig.endpoints.token), values, props.requestCallback)
    }

    return (
        <>
            {!props.session.authenticated &&
            <>
                <DataForm
                    data={LoginFormData}
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
)(AuthLoginForm);
