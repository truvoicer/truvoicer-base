import React from 'react';
import {connect} from "react-redux";
import {
    getPageDataMiddleware,
    setModalContentMiddleware
} from "../../../redux/middleware/page-middleware";
import {blockComponentsConfig} from "../../../config/block-components-config";
import {siteConfig} from "../../../../config/site-config";
import {logout} from "../../../redux/actions/session-actions";

const AuthButton = (props) => {
    const options = props.data.auth_options;
    const showAuthLoginModal = () => {
        props.setModalContentMiddleware(blockComponentsConfig.components.authentication_login.name, {}, true)
    }
    const logoutHandler = (e) => {
        e.preventDefault();
        logout();
    }

    return (
        <div className="Appointment">
            {!props.session.authenticated &&
            <div className="phone_num d-none d-xl-block">
                <a onClick={showAuthLoginModal}>
                    {options.login_label}
                </a>
            </div>
            }
            {props.session.authenticated &&
            <>
                <div className="phone_num d-none d-xl-block">
                    <a href={siteConfig.defaultUserAccountHref}>
                        <span className={"d-none d-md-block"}>{options.account_label}</span>
                        <span className={"d-block d-md-none"}><i className="fas fa-user-circle"/></span>
                    </a>
                </div>
                <div className="phone_num d-none d-xl-block">
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
        </div>
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
