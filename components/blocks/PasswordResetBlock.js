import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {blockComponentsConfig} from "../../config/block-components-config";
import {SESSION_PASSWORD_RESET_KEY, SESSION_USER, SESSION_USER_ID} from "../../redux/constants/session-constants";
import {buildWpApiUrl, publicApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";

const PasswordResetBlock = (props) => {
    const [response, setResponse] = useState({
        success: false,
        message: "Please wait, we're Confirming your credentials..."
    });
    const modalContext = useContext(AppModalContext);

    const templateManager = new TemplateManager(useContext(TemplateContext));

    const showAuthRegisterModal = (e) => {
        e.preventDefault()
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_register.name,
            show: true
        });

    }
    const validateCallback = (error, data) => {
        if (error) {
            setResponse({
                success: false,
                message: data.response.data.message
            })
        } else {
            setResponse({
                success: true,
                message: data.message
            })
        }
    }

    useEffect(() => {
        publicApiRequest(buildWpApiUrl(wpApiConfig.endpoints.passwordResetValidate), {
            reset_key: props.session[SESSION_PASSWORD_RESET_KEY],
            user_id: props.session[SESSION_USER][SESSION_USER_ID]
        }, validateCallback)
    }, [props.session[SESSION_PASSWORD_RESET_KEY], props.session[SESSION_USER][SESSION_USER_ID]])
    function defaultView() {
        return (
            <div className="site-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 mb-5" data-aos="fade">
                            <div className="row form-group bg-light">
                                <div className="col-12">
                                    <p className={"text-center p-3 m-0 "}>
                                        {response.message}
                                    </p>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className="col-12">
                                    <p>No account yet? <a href={siteConfig.defaultRegisterHref}
                                                          onClick={showAuthRegisterModal}>Register</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'account',
        templateId: 'passwordResetBlock',
        defaultComponent: defaultView(),
        props: {
            showAuthRegisterModal: showAuthRegisterModal,
            validateCallback: validateCallback,
            defaultView: defaultView,
            response: response,
            setResponse: setResponse
        }
    })
}

function mapStateToProps(state) {
    return {
        session: state.session,
    };
}

export default connect(
    mapStateToProps,
    null
)(PasswordResetBlock);
