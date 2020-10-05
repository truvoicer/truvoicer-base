import React from "react";
import {connect} from "react-redux";
import {setModalContentMiddleware, setUserAccountMenuMiddleware} from "../../../redux/middleware/page-middleware";
import AuthLoginForm from "./AuthLoginForm";
import {siteConfig} from "../../../../config/site-config";
import {wpApiConfig} from "../../../config/wp-api-config";

const LoginBlock = (props) => {

    const showAuthRegisterModal = (e) => {
        e.preventDefault()
        props.setModalContentMiddleware(wpApiConfig.components.authentication_register.name, {}, true)
    }

    return (
        <div className="site-section bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 mb-5" data-aos="fade">
                        <h2 className="mb-5 text-black">Sign In</h2>
                        <AuthLoginForm>
                            <div className="row form-group">
                                <div className="col-12">
                                    <p>No account yet? <a href={siteConfig.defaultRegisterHref} onClick={showAuthRegisterModal}>Register</a></p>
                                </div>
                            </div>
                        </AuthLoginForm>
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