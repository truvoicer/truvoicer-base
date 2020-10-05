import React, {useState} from "react";
import AuthLoginForm from "./AuthLoginForm";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import Button from "@material-ui/core/Button";
import AuthRegisterForm from "./AuthRegisterForm";
import {connect} from "react-redux";
import {showPageModalMiddleware} from "../../../redux/middleware/page-middleware";

const RegisterDialog = (props) => {
    const [showRegisterForm, setShowRegisterForm] = useState(true);
    const [response, setResponse] = useState({
        error: false,
        success: false,
        message: ""
    });
    const requestCallback = (error, data) => {
        if (error) {
            setResponse({
                error: true,
                success: false,
                message: data.message
            })
        } else {
            setResponse({
                error: false,
                success: true,
                message: data.message
            })
            setShowRegisterForm(false)
            // props.showPageModalMiddleware(false);
        }
    }

    return (
        <div className={"auth-wrapper"}>
            {response.success &&
            <div className="p-5 bg-white">
                <p className={"text-success"}>{response.message}</p>
            </div>
            }
            {response.error &&
            <div className="p-5 bg-white">
                <p className={"text-danger"}>{response.message}</p>
            </div>
            }
            {showRegisterForm &&
            <>
                <h2 className="text-black">Register</h2>
                <div className={"auth-wrapper--signup-form"}>
                    <AuthRegisterForm requestCallback={requestCallback} />
                </div>
                <div className={"horizontal-divider"}>
                    <span>OR</span>
                </div>
                <div className={"auth-wrapper--google auth-wrapper--button"}>
                    <AuthGoogle
                        requestCallback={requestCallback}
                        buttonClass={"google-light-red"}
                        iconClass={"fa-google"}
                        buttonLabel={"Sign up with Google"}
                    />
                </div>
                <div className={"auth-wrapper--facebook auth-wrapper--button"}>
                    <AuthFacebook
                        requestCallback={requestCallback}
                        buttonClass={"facebook-light-blue"}
                        iconClass={"fa-facebook-f"}
                        buttonLabel={"Sign up with Facebook"}
                    />
                </div>
            </>
            }
        </div>
    )
}
export default connect(
    null,
    {
        showPageModalMiddleware
    }
)(RegisterDialog);