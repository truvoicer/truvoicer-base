import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {blockComponentsConfig} from "../../../config/block-components-config";
import PasswordResetForm from "./PasswordResetForm";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const PasswordResetDialog = ({heading = null}) => {
    const [showForm, setShowForm] = useState(false);
    const [response, setResponse] = useState({
        error: false,
        success: false,
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
    const showAuthLoginModal = (e) => {
        e.preventDefault();
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_login.name,
            show: true,
            showFooter: false
        });
    }
    const requestCallback = (error, data) => {
        if (error) {
            setResponse({
                error: true,
                success: false,
                message: data.response.data.message
            })
        } else {
            setResponse({
                error: false,
                success: true,
                message: data.message
            })
            setShowForm(false)
        }
    }


        return (
            <div className={"auth-wrapper"}>
                {!showForm &&
                    <>
                        {isNotEmpty(heading) &&
                            <h2 className="text-dark text-black">{heading || siteConfig.passwordResetHeading || ''}</h2>
                        }
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
                        <div className={"auth-wrapper--login-form"}>
                            <PasswordResetForm requestCallback={requestCallback}>
                                <p className={"mb-0 text-center"}>
                                    No account yet?
                                    <a className={"text-danger"} href={siteConfig.defaultRegisterHref} onClick={showAuthRegisterModal}>
                                        Register
                                    </a>
                                </p>
                                <p className={"mb-0 text-center"}>
                                    Already registered?
                                    <a className={"text-danger"} href={siteConfig.defaultLoginHref} onClick={showAuthLoginModal}>
                                        Sign In
                                    </a>
                                </p>
                            </PasswordResetForm>
                        </div>
                    </>
                }
            </div>
        );
}
PasswordResetDialog.category = 'account';
PasswordResetDialog.templateId = 'passwordResetDialog';
export default connect(
    null,
    null
)(PasswordResetDialog);
