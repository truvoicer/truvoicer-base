import React from 'react';
import {connect} from "react-redux";
import {
    getPageDataMiddleware,
    setModalContentMiddleware
} from "../../../redux/middleware/page-middleware";
import {componentsConfig} from "../../../../config/components-config";
import {siteConfig} from "../../../../config/site-config";
import {logout} from "../../../redux/actions/session-actions";

const AuthButton = (props) => {
    const options = props.data.auth_options;

    const showAuthLoginModal = () => {
        props.setModalContentMiddleware(componentsConfig.components.authentication_login.name, {}, true)
    }
    const logoutHandler = (e) => {
        e.preventDefault();
        logout();
    }

    return (
        <>
            {!props.session.authenticated &&
            <div className="login-area">
                <a onClick={showAuthLoginModal}>
                    <span>{options.login_label} / {options.register_label}</span>
                </a>
            </div>
            }
            {props.session.authenticated &&
            <>
                <div className="login-area">
                    <a href={siteConfig.defaultUserAccountHref}>
                        <span className={"d-none d-md-block"}>{options.account_label}</span>
                        <span className={"d-block d-md-none"}><i className="fas fa-user-circle"/></span>
                    </a>
                </div>
                <div className="login-area">
                    <a
                        href={siteConfig.defaultLogoutHref}
                        onClick={logoutHandler}
                    >
                        <span className={"d-none d-md-block"}>{"Logout"}</span>
                        <span className={"d-block d-md-none"}><i className="fas fa-sign-out-alt"/></span>
                    </a>
                </div>
            </>
            }
        </>
    );
}

function mapStateToProps(state) {
    return {
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    {
        getPageDataMiddleware,
        setModalContentMiddleware
    }
)(AuthButton);
