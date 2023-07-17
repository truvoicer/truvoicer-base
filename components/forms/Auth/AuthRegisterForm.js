import React, {useState} from 'react';
import {connect} from "react-redux";
import {createUserMiddleware} from "../../../redux/middleware/session-middleware";
import DataForm from "../DataForm/DataForm";
import {RegisterFormData} from "../../../config/forms/register-form";
import {setIsAuthenticatingAction, setSessionLocalStorage} from "@/truvoicer-base/redux/actions/session-actions";

const AuthRegisterForm = (props) => {
    const [submitButtonLabel, setSubmitButtonLabel] = useState("Register");

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
