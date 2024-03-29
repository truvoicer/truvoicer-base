import React, {useContext} from 'react';
import {connect} from "react-redux";
import {
    getPageDataMiddleware
} from "../../../redux/middleware/page-middleware";
import {blockComponentsConfig} from "../../../config/block-components-config";
import {siteConfig} from "@/config/site-config";
import {logout} from "../../../redux/actions/session-actions";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {faArrowCircleRight, faSignOutAlt, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const AuthButton = (props) => {
    const options = props.data.auth_options;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const modalContext = useContext(AppModalContext);
    const showAuthLoginModal = () => {
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_login.name,
            show: true
        });
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
                                <span className={"d-block d-md-none"}><FontAwesomeIcon icon={faUserCircle} /></span>
                            </a>
                        </div>
                        <div className="phone_num d-none d-xl-block">
                            <a
                                href={siteConfig.defaultLogoutHref}
                                onClick={logoutHandler}
                            >
                                <span className={"d-none d-md-block"}>{"Logout"}</span>
                                <span className={"d-block d-md-none"}><FontAwesomeIcon icon={faSignOutAlt} /></span>
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
AuthButton.category = 'buttons';
AuthButton.templateId = 'authButton';
export default connect(
    mapStateToProps,
    {
        getPageDataMiddleware
    }
)(AuthButton);
