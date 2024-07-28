import React, {useContext, useState} from "react";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import AuthRegisterForm from "./AuthRegisterForm";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {blockComponentsConfig} from "../../../config/block-components-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const RegisterDialog = ({heading = null}) => {
    const [showRegisterForm, setShowRegisterForm] = useState(true);
    const [response, setResponse] = useState({
        error: false,
        success: false,
        message: ""
    });
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const modalContext = useContext(AppModalContext);
    const requestCallback = (error, data) => {
        if (error) {
            setResponse({
                error: true,
                success: false,
                message: data?.message
            })
        } else {
            modalContext.showModal({
                show: false
            });
            setShowRegisterForm(false)
        }
    }
    const showAuthLoginModal = (e) => {
        e.preventDefault();
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_login.name,
            show: true,
            showFooter: false
        });
    }

        return (
            <div className={"auth-wrapper"}>
                {!response.success && isNotEmpty(heading) &&
                    <h2 className="text-dark text-black">{heading || siteConfig.registerHeading || ''}</h2>
                }
                {response.success &&
                    <div className="bg-white p-3">
                        <p className={"text-center"}>{response.message}</p>
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
                            {templateManager.render(<AuthRegisterForm requestCallback={requestCallback}>
                                <p className={"mb-0 text-center"}>
                                    Already registered?
                                    <a className={"text-danger"} href={siteConfig.defaultLoginHref}
                                       onClick={showAuthLoginModal}>
                                        Sign In
                                    </a>
                                </p>
                            </AuthRegisterForm>)}
                        </div>
                        <div className={"horizontal-divider"}>
                            <span>OR</span>
                        </div>
                        <div className={"auth-wrapper--google auth-wrapper--button"}>
                            {templateManager.render(<AuthGoogle
                                requestCallback={requestCallback}
                                buttonLabel={"Sign up with Google"}
                            />)}
                        </div>
                        <div className={"auth-wrapper--facebook auth-wrapper--button mt-4"}>
                            {templateManager.render(<AuthFacebook
                                requestCallback={requestCallback}
                                buttonLabel={"Sign up with Facebook"}
                            />)}
                        </div>
                    </>
                }
            </div>
        );
}
RegisterDialog.category = 'auth';
RegisterDialog.templateId = 'registerDialog';
export default connect(
    null,
    null
)(RegisterDialog);
