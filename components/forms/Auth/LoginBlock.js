import React, {useState} from "react";
import {connect} from "react-redux";
import AuthLoginForm from "./AuthLoginForm";
import {siteConfig} from "../../../../config/site-config";
import {componentsConfig} from "../../../../config/components-config";
import {setModalContentAction} from "../../../redux/actions/page-actions";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";

const LoginBlock = (props) => {
    const [error, setError] = useState({
        show: false,
        message: ""
    });
    const showAuthRegisterModal = (e) => {
        e.preventDefault()
        setModalContentAction(componentsConfig.components.authentication_register.name, {}, true)
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
export default connect(
    null,
    null
)(LoginBlock);