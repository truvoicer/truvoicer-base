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

    const submitHandler = (values) => {
        let requestData = {...values};
        requestData.auth_provider = "wordpress";
        getSessionTokenMiddleware(wpApiConfig.endpoints.auth.login, requestData, props.requestCallback)
    }

    function defaultView() {
        return (
            <>
                {!props.session.authenticated &&
                    <>
                        <DataForm
                            data={LoginFormData}
                            formType={"single"}
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
        templateId: 'authLoginForm',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            submitHandler: submitHandler,
            setSubmitButtonText: setSubmitButtonText,
            submitButtonText: submitButtonText,
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
)(AuthLoginForm);
