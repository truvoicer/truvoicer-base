import React, {useState} from "react";
import AuthLoginForm from "./AuthLoginForm";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import {showPageModalMiddleware} from "../../../redux/middleware/page-middleware";
import SocialButton from "../Buttons/SocialButton";

const LoginDialog = (props) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [error, setError] = useState({
        show: false,
        message: ""
    });

    const requestCallback = (error, data) => {
        if (error) {
            console.error(data)
            setError({
                show: true,
                message: data.message
            });
        } else {
            setShowLoginForm(false);
            props.showPageModalMiddleware(false);
        }
    }

    return (
        <div className={"auth-wrapper"}>
            {!showLoginForm &&
            <>
                <h2 className="text-black">Sign In</h2>
                {error.show &&
                <div className={"site-form--error--block"}>
                    {error.message}
                </div>
                }
                <div className={"auth-wrapper--login-form"}>
                    <AuthLoginForm requestCallback={requestCallback}/>
                </div>
                <div className={"horizontal-divider"}>
                    <span>OR</span>
                </div>
                <div className={"auth-wrapper--google auth-wrapper--button"}>
                    <AuthGoogle
                        requestCallback={requestCallback}
                        buttonClass={"google-light-red"}
                        iconClass={"fa-google"}
                        buttonLabel={"Sign in with Google"}
                    />
                </div>
                <div className={"auth-wrapper--facebook auth-wrapper--button"}>
                    <AuthFacebook
                        requestCallback={requestCallback}
                        buttonClass={"facebook-light-blue"}
                        iconClass={"fa-facebook-f"}
                        buttonLabel={"Sign in with Facebook"}
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
)(LoginDialog);