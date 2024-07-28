import React, {useContext, useState} from 'react';
import {connect} from "react-redux";
import {buildWpApiUrl, publicApiRequest} from "../../../library/api/wp/middleware";
import DataForm from "../DataForm/DataForm";
import {wpApiConfig} from "../../../config/wp-api-config";
import {PasswordResetRequestData} from "../../../config/forms/password-reset-request-form";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";


const PasswordResetForm = (props) => {
    const [submitButtonText, setSubmitButtonText] = useState("Request Password Reset",);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const submitHandler = async (values) => {
        const response = await publicApiRequest(
            'GET',
            buildWpApiUrl(wpApiConfig.endpoints.passwordReset),
            values,
        )

        props.requestCallback(false, response.data);
    }


        return (
            <>
                {!props.session.authenticated &&
                    <>
                        {templateManager.render(<DataForm
                            data={PasswordResetRequestData}
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
PasswordResetForm.category = 'auth';
PasswordResetForm.templateId = 'passwordResetForm';
export default connect(
    mapStateToProps,
    null
)(PasswordResetForm);
