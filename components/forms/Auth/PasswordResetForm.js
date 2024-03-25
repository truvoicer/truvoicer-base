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

    function defaultView() {
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
    return templateManager.getTemplateComponent({
        category: 'auth',
        templateId: 'passwordResetForm',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            submitHandler: submitHandler,
            submitButtonText: submitButtonText,
            setSubmitButtonText: setSubmitButtonText,
            ...props
        }
    });
}

function mapStateToProps(state) {
    // console.log(state.session)
    return {
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(PasswordResetForm);
