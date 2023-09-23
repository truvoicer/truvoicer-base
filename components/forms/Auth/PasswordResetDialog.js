import React, {useState} from "react";
import {connect} from "react-redux";
import {showPageModalMiddleware} from "../../../redux/middleware/page-middleware";
import {siteConfig} from "../../../../config/site-config";
import {setModalContentAction} from "../../../redux/actions/page-actions";
import {blockComponentsConfig} from "../../../config/block-components-config";
import PasswordResetForm from "./PasswordResetForm";

const PasswordResetDialog = (props) => {
    const [showForm, setShowForm] = useState(false);
    const [response, setResponse] = useState({
        error: false,
        success: false,
        message: ""
    });
    const showAuthRegisterModal = (e) => {
        e.preventDefault()
        setModalContentAction(blockComponentsConfig.components.authentication_register.name, {}, true)
    }
    const showAuthLoginModal = (e) => {
        e.preventDefault();
        setModalContentAction(blockComponentsConfig.components.authentication_login.name, {}, true)
    }
    const requestCallback = (error, data) => {
        if (error) {
            setResponse({
                error: true,
                success: false,
                message: data.response.data.message
            })
        } else {
            setResponse({
                error: false,
                success: true,
                message: data.message
            })
            setShowForm(false)
        }
    }

    return (
        <div className={"auth-wrapper"}>
            {!showForm &&
            <>
                <h2 className="text-dark text-black">Password Reset</h2>
                {response.success &&
                <div className="bg-white">
                    <p className={"text-success"}>{response.message}</p>
                </div>
                }
                {response.error &&
                <div className="bg-white">
                    <p className={"text-danger"}>{response.message}</p>
                </div>
                }
                <div className={"auth-wrapper--login-form"}>
                    <PasswordResetForm requestCallback={requestCallback}>
                        <p className={"mb-0 text-center"}>
                            No account yet?
                            <a className={"text-danger"} href={siteConfig.defaultRegisterHref} onClick={showAuthRegisterModal}>
                                Register
                            </a>
                        </p>
                        <p className={"mb-0 text-center"}>
                            Already registered?
                            <a className={"text-danger"} href={siteConfig.defaultLoginHref} onClick={showAuthLoginModal}>
                                Sign In
                            </a>
                        </p>
                    </PasswordResetForm>
                </div>
            </>
            }
        </div>
    )
}
export default connect(
    null,
    {
        showPageModalMiddleware
    }
)(PasswordResetDialog);
