import React, {useState} from 'react';
import {siteConfig} from "../../../../config/site-config";
import {connect} from "react-redux";
import {createUserMiddleware} from "../../../redux/middleware/session-middleware";
import DataForm from "../DataForm";
import {RegisterFormData} from "../../../config/forms/register-form";

const AuthRegisterForm = (props) => {
    const [submitButtonLabel, setSubmitButtonLabel] = useState("Register");

    const formSubmitHandler = (values) => {
        values.auth_type = "wordpress";
        props.createUserMiddleware(values, props.requestCallback)
    }

    return (
        <>
            <DataForm
                data={RegisterFormData}
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
