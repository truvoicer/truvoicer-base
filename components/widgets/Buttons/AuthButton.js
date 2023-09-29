import React, {useContext} from 'react';
import {connect} from "react-redux";
import {
    getPageDataMiddleware,
    setModalContentMiddleware
} from "../../../redux/middleware/page-middleware";
import {blockComponentsConfig} from "../../../config/block-components-config";
import {siteConfig} from "../../../../config/site-config";
import {logout} from "../../../redux/actions/session-actions";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const AuthButton = (props) => {
    const options = props.data.auth_options;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const showAuthLoginModal = () => {
        props.setModalContentMiddleware(blockComponentsConfig.components.authentication_login.name, {}, true)
    }
    const logoutHandler = (e) => {
        e.preventDefault();
        logout();
    }

    function defaultView() {
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

    return templateManager.getTemplateComponent({
        category: 'buttons',
        templateId: 'authButton',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            options: options,
            showAuthLoginModal,
            logoutHandler,
            ...props
        }
    })
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
