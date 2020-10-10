import React from "react";
import {connect} from "react-redux";
import AuthRegisterForm from "./AuthRegisterForm";
import {siteConfig} from "../../../../config/site-config";
import {componentsConfig} from "../../../../config/components-config";
import {setModalContentAction} from "../../../redux/actions/page-actions";

const LoginBlock = (props) => {
    const showAuthLoginModal = (e) => {
        e.preventDefault();
        setModalContentAction(componentsConfig.components.authentication_login.name, {}, true)
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
    null
)(LoginBlock);