import React, {useContext, useState} from "react";
import AuthLoginForm from "./AuthLoginForm";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {blockComponentsConfig} from "../../../config/block-components-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";

const LoginDialog = (props) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [error, setError] = useState({
        show: false,
        message: ""
    });
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const modalContext = useContext(AppModalContext);
    const showAuthRegisterModal = (e) => {
        e.preventDefault()
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_register.name,
            show: true
        });
    }
    const showForgotPasswordModal = (e) => {
        e.preventDefault()
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_password_reset.name,
            show: true
        });
    }
    const requestCallback = (error, data) => {
        console.log(error, data)
        if (error) {
            setError({
                show: true,
                message: data.message
            });
        } else {
            setShowLoginForm(false);
            modalContext.showModal({
                show: false
            });
        }
    }

    function defaultView() {
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
        );
    }

    return templateManager.getTemplateComponent({
        category: 'auth',
        templateId: 'loginDialog',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            showLoginForm: showLoginForm,
            setShowLoginForm: setShowLoginForm,
            showAuthRegisterModal: showAuthRegisterModal,
            showForgotPasswordModal: showForgotPasswordModal,
            requestCallback: requestCallback,
            error: error,
            setError: setError,
            ...props
        }
    })
}
export default connect(
    null,
    null
)(LoginDialog);
