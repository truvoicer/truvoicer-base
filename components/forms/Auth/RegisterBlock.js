import React, {useState} from "react";
import {connect} from "react-redux";
import AuthRegisterForm from "./AuthRegisterForm";
import {siteConfig} from "../../../../config/site-config";
import {componentsConfig} from "../../../../config/components-config";
import {setModalContentAction} from "../../../redux/actions/page-actions";
import AuthLoginForm from "./AuthLoginForm";
import AuthGoogle from "./AuthGoogle";
import AuthFacebook from "./AuthFacebook";

const RegisterBlock = (props) => {
    const [error, setError] = useState({
        show: false,
        message: ""
    });
    const showAuthLoginModal = (e) => {
        e.preventDefault();
        setModalContentAction(componentsConfig.components.authentication_login.name, {}, true)
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
export default connect(
    null,
    null
)(RegisterBlock);