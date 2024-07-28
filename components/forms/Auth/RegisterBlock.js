import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import AuthRegisterForm from "./AuthRegisterForm";
import {siteConfig} from "@/config/site-config";
import {blockComponentsConfig} from "../../../config/block-components-config";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const RegisterBlock = ({heading = null}) => {
    const [error, setError] = useState({
        show: false,
        message: ""
    });
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const modalContext = useContext(AppModalContext);
    const showAuthLoginModal = (e) => {
        e.preventDefault();
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_login.name,
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
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 mt-5 mb-5" data-aos="fade">
                            {isNotEmpty(heading) &&
                                <h2 className="mb-5 text-black">{heading || siteConfig.registerHeading || ''}</h2>
                            }
                            {templateManager.render(<AuthRegisterForm>
                                <div className="row form-group">
                                    <div className="col-12">
                                        <p>Already registered? <a href={siteConfig.defaultLoginHref}
                                                                  onClick={showAuthLoginModal}>Sign In</a></p>
                                    </div>
                                </div>
                            </AuthRegisterForm>)}
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
RegisterBlock.category = 'account';
RegisterBlock.templateId = 'registerBlock';
export default connect(
    null,
    null
)(RegisterBlock);
