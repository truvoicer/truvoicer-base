import React, {useContext, useState} from 'react';
import {connect} from "react-redux";
import {buildWpApiUrl} from "../../../library/api/wp/middleware";
import DataForm from "../DataForm/DataForm";
import {LoginFormData} from "../../../config/forms/login-form";
import {wpApiConfig} from "../../../config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";


const AuthLoginForm = (props) => {
    const [submitButtonText, setSubmitButtonText] = useState("Login");
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const submitHandler = async (values) => {
        let requestData = {...values};
        requestData.auth_provider = "wordpress";
        const tokenResponse = await getSessionTokenMiddleware(wpApiConfig.endpoints.auth.login, requestData);
        if (typeof props.requestCallback === "function") {
            props.requestCallback((tokenResponse === false), tokenResponse);
        }
    }


        return (
            <>
                {!props.session.authenticated &&
                    <>
                        {templateManager.render(<DataForm
                            data={LoginFormData}
                            formType={"single"}
                            submitCallback={submitHandler}
                            submitButtonText={submitButtonText}
                        >
                            {props.children}
                        </DataForm>)}
                    </>
                }
            </>
        );
}

function mapStateToProps(state) {
    return {
        session: state.session
    };
}
AuthLoginForm.category = 'auth';
AuthLoginForm.templateId = 'authLoginForm';
export default connect(
    mapStateToProps,
    null
)(AuthLoginForm);
