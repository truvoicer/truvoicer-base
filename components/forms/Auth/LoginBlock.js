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

const LoginBlock = (props) => {
    const [error, setError] = useState({
        show: false,
        message: ""
    });
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const modalContext = useContext(AppModalContext);
    const showAuthRegisterModal = (e) => {
        e.preventDefault()
        //console.log('dss')
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
    function defaultView() {
        return (
            <div className="site-section bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 mt-5 mb-5" data-aos="fade">
                            <h2 className="mb-5 text-black">Sign In</h2>
                            <AuthLoginForm>
                                <div className="row form-group">
                                    <div className="col-12">
                                        <p>No account yet? <a href={siteConfig.defaultRegisterHref} onClick={showAuthRegisterModal}>Register</a></p>
                                    </div>
                                </div>
                            </AuthLoginForm>
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
        templateId: 'loginBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            error: error,
            setError: setError,
            showAuthRegisterModal: showAuthRegisterModal,
            requestCallback: requestCallback,
            ...props
        }
    })
}
export default connect(
    null,
    null
)(LoginBlock);
