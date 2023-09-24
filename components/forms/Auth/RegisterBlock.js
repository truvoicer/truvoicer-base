import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import AuthRegisterForm from "./AuthRegisterForm";
import {siteConfig} from "../../../../config/site-config";
import {blockComponentsConfig} from "../../../config/block-components-config";
import {setModalContentAction} from "../../../redux/actions/page-actions";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const RegisterBlock = (props) => {
    const [error, setError] = useState({
        show: false,
        message: ""
    });
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const showAuthLoginModal = (e) => {
        e.preventDefault();
        setModalContentAction(blockComponentsConfig.components.authentication_login.name, {}, true)
    }
    const requestCallback = (error, data) => {
        if (error) {
            console.error(data)
            setError({
                show: true,
                message: data.message
            });
        }
    }
    function defaultView() {
        return (
            <div className="site-section bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 mt-5 mb-5" data-aos="fade">
                            <h2 className="mb-5 text-black">Sign Up</h2>
                            <AuthRegisterForm>
                                <div className="row form-group">
                                    <div className="col-12">
                                        <p>Already registered? <a href={siteConfig.defaultLoginHref} onClick={showAuthLoginModal}>Sign In</a></p>
                                    </div>
                                </div>
                            </AuthRegisterForm>
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'account',
        templateId: 'registerBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            error: error,
            setError: setError,
            showAuthLoginModal: showAuthLoginModal,
            requestCallback: requestCallback,
            ...props
        }
    })
}
export default connect(
    null,
    null
)(RegisterBlock);
