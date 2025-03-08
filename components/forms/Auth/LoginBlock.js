import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import AuthLoginForm from "./AuthLoginForm";
import {siteConfig} from "@/config/site-config";
import {blockComponentsConfig} from "../../../config/block-components-config";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const LoginBlock = ({heading = null}) => {
    const [error, setError] = useState({
        show: false,
        message: ""
    });
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const modalContext = useContext(AppModalContext);
    const showAuthRegisterModal = (e) => {
        e.preventDefault();
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_register.name,
            show: true
        });
    }
    const requestCallback = (error, data) => {
        if (error) {
            console.error(data)
            setError({
                show: true,
                message: data.message
            });
            return;
        }
        modalContext.showModal({
            show: false
        });
    }

        return (
            <div className="site-section bg-light">
                <div className="container section-block">
                    <div className="row justify-content-center">
                        <div className="col-md-7 mt-5 mb-5" data-aos="fade">
                            {isNotEmpty(heading) &&
                                <h2 className="mb-5 text-black">{heading || siteConfig.loginHeading || ''}</h2>
                            }
                            {templateManager.render(<AuthLoginForm>
                                <div className="row form-group">
                                    <div className="col-12">
                                        <p>No account yet? <a href={siteConfig.defaultRegisterHref}
                                                              onClick={showAuthRegisterModal}>Register</a></p>
                                    </div>
                                </div>
                            </AuthLoginForm>)}
                            <div className={"horizontal-divider"}>
                                <span>OR</span>
                            </div>
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
                    </div>
                </div>
            </div>
        );
}
LoginBlock.category = 'account';
LoginBlock.templateId = 'loginBlock';
export default connect(
    null,
    null
)(LoginBlock);
