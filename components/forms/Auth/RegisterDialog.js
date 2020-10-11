import React, {useState} from "react";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import AuthRegisterForm from "./AuthRegisterForm";
import {connect} from "react-redux";
import {showPageModalMiddleware} from "../../../redux/middleware/page-middleware";
import {siteConfig} from "../../../../config/site-config";
import {componentsConfig} from "../../../../config/components-config";
import {setModalContentAction} from "../../../redux/actions/page-actions";

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
        }
    }
    const showAuthLoginModal = (e) => {
        e.preventDefault();
        setModalContentAction(componentsConfig.components.authentication_login.name, {}, true)
    }
    return (
        <div className={"auth-wrapper"}>
            <h2 className="text-dark text-black">Register</h2>
            {response.success &&
            <div className="bg-white">
                <p className={"text-success"}>{response.message}</p>
            </div>
            }
            {response.error &&
            <div className="bg-white">
                <p className={"text-danger"}>{response.message}</p>
            </div>
            }
            {showRegisterForm &&
            <>
                <div className={"auth-wrapper--signup-form"}>
                    <AuthRegisterForm requestCallback={requestCallback}>
                        <p className={"mb-0 text-center"}>
                            Already registered?
                            <a className={"text-danger"} href={siteConfig.defaultLoginHref} onClick={showAuthLoginModal}>
                                Sign In
                            </a>
                        </p>
                    </AuthRegisterForm>
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