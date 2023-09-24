import React, {useContext, useState} from 'react';
import {connect} from "react-redux";
import {createUserMiddleware} from "../../../redux/middleware/session-middleware";
import DataForm from "../DataForm/DataForm";
import {RegisterFormData} from "../../../config/forms/register-form";
import {setIsAuthenticatingAction, setSessionLocalStorage} from "@/truvoicer-base/redux/actions/session-actions";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const AuthRegisterForm = (props) => {
    const [submitButtonLabel, setSubmitButtonLabel] = useState("Register");
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function requestCallback(error, data) {
        console.log('req')
        console.log(!error && data.status === 'success' && data?.token)
        if (!error && data.status === 'success' && data?.token) {
            setSessionLocalStorage(data.token, data.expiresAt)
            setIsAuthenticatingAction(false)
        }
        if (typeof props.requestCallback === "function") {
            props.requestCallback(error, data)
        }
    }
    const formSubmitHandler = (values) => {
        values.auth_provider = "wordpress";
        props.createUserMiddleware(values, requestCallback)
    }

    function defaultView() {
        return (
            <>
                <DataForm
                    data={RegisterFormData}
                    formType={"single"}
                    submitCallback={formSubmitHandler}
                    submitButtonText={submitButtonLabel}
                >
                    {props.children}
                </DataForm>
            </>

        );
    }
    return templateManager.getTemplateComponent({
        category: 'auth',
        templateId: 'authRegisterForm',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            requestCallback: requestCallback,
            formSubmitHandler: formSubmitHandler,
            submitButtonLabel: submitButtonLabel,
            setSubmitButtonLabel: setSubmitButtonLabel,
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
    {createUserMiddleware}
)(AuthRegisterForm);
