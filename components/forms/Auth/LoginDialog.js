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
import Divider from "@/truvoicer-base/components/dividers/Divider";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const LoginDialog = ({heading = null}) => {
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
            show: true,
            showFooter: false
        });
    }
    const showForgotPasswordModal = (e) => {
        e.preventDefault()
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_password_reset.name,
            show: true,
            showFooter: false
        });
    }
    const requestCallback = (error, data) => {
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


        return (
            <div className={"auth-wrapper"}>
                {!showLoginForm &&
                    <>
                        {isNotEmpty(heading) &&
                            <h2 className="mb-5 text-black">{heading || siteConfig.loginHeading || ''}</h2>
                        }
                        {error.show &&
                            <div className={"site-form--error--block"}>
                                {error.message}
                            </div>
                        }
                        <div className={"auth-wrapper--login-form"}>
                            {templateManager.render(<AuthLoginForm requestCallback={requestCallback}>
                                <p className={"mb-0 text-center"}>
                                    <a className={"text-danger"} href={siteConfig.defaultForgotPasswordHref}
                                       onClick={showForgotPasswordModal}>
                                        Forgot Password?
                                    </a>
                                </p>
                                <p className={"mb-0 text-center"}>
                                    <span>No account yet?</span>
                                    <a className={"text-primary ms-1"} href={siteConfig.defaultRegisterHref}
                                       onClick={showAuthRegisterModal}>
                                        Register
                                    </a>
                                </p>
                            </AuthLoginForm>)}
                        </div>
                        <Divider classes={'my-3'}>
                            <span>OR</span>
                        </Divider>

                        <div className={"auth-wrapper--button-group"}>
                            <div className={"auth-wrapper--google auth-wrapper--button"}>
                                {templateManager.render(<AuthGoogle
                                    requestCallback={requestCallback}
                                    buttonLabel={"Sign in with Google"}
                                />)}
                            </div>
                            <div className={"auth-wrapper--facebook auth-wrapper--button mt-4"}>
                                {templateManager.render(<AuthFacebook
                                    requestCallback={requestCallback}
                                    buttonLabel={"Sign in with Facebook"}
                                />)}
                            </div>
                        </div>
                    </>
                }
            </div>
        );
}
LoginDialog.category = 'auth';
LoginDialog.templateId = 'loginDialog';
export default connect(
    null,
    null
)(LoginDialog);
