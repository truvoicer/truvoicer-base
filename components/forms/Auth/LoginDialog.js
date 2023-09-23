import React, {useState} from "react";
import AuthLoginForm from "./AuthLoginForm";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import {connect} from "react-redux";
import {showPageModalMiddleware} from "../../../redux/middleware/page-middleware";
import {siteConfig} from "../../../../config/site-config";
import {setModalContentAction} from "../../../redux/actions/page-actions";
import {blockComponentsConfig} from "../../../config/block-components-config";

const LoginDialog = (props) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [error, setError] = useState({
        show: false,
        message: ""
    });
    const showAuthRegisterModal = (e) => {
        e.preventDefault()
        setModalContentAction(blockComponentsConfig.components.authentication_register.name, {}, true)
    }
    const showForgotPasswordModal = (e) => {
        e.preventDefault()
        setModalContentAction(blockComponentsConfig.components.authentication_password_reset.name, {}, true)
    }
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
                <h2 className="text-dark text-black">Sign In</h2>
                {error.show &&
                <div className={"site-form--error--block"}>
                    {error.message}
                </div>
                }
                <div className={"auth-wrapper--login-form"}>
                    <AuthLoginForm requestCallback={requestCallback}>
                        <p className={"mb-0 text-center"}>
                            <a className={"text-danger"} href={siteConfig.defaultForgotPasswordHref} onClick={showForgotPasswordModal}>
                                Forgot Password?
                            </a>
                        </p>
                        <p className={"mb-0 text-center"}>
                            No account yet?
                            <a className={"text-primary ml-1"} href={siteConfig.defaultRegisterHref} onClick={showAuthRegisterModal}>
                                Register
                            </a>
                        </p>
                    </AuthLoginForm>
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
