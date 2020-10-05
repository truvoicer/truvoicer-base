import React from "react";
import {connect} from "react-redux";
import {setModalContentMiddleware} from "../../../redux/middleware/page-middleware";
import AuthRegisterForm from "./AuthRegisterForm";
import {siteConfig} from "../../../../config/site-config";
import {wpApiConfig} from "../../../config/wp-api-config";

const LoginBlock = (props) => {

    const showAuthLoginModal = (e) => {
        e.preventDefault();
        props.setModalContentMiddleware(wpApiConfig.components.authentication_login.name, {}, true)
    }

    return (
        <div className="site-section bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 mb-5" data-aos="fade">
                        <h2 className="mb-5 text-black">Sign Up</h2>
                        <AuthRegisterForm>
                            <div className="row form-group">
                                <div className="col-12">
                                    <p>Already registered? <a href={siteConfig.defaultLoginHref} onClick={showAuthLoginModal}>Sign In</a></p>
                                </div>
                            </div>
                        </AuthRegisterForm>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default connect(
    null,
    {
        setModalContentMiddleware

    }
)(LoginBlock);