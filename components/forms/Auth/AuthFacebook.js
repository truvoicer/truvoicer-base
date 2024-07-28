import React, {useContext} from "react";
import {connect} from "react-redux";
import SocialButton from "../Buttons/SocialButton";
import {wpApiConfig} from "../../../config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";
import {FbAuthContext} from "@/truvoicer-base/config/contexts/FacebookAuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF} from "@fortawesome/free-brands-svg-icons";

const AuthFacebook = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const fbContext = useContext(FbAuthContext);
    const responseFacebook = async (response) => {
        const tokenResponse = await getSessionTokenMiddleware(
            wpApiConfig.endpoints.auth.login,
            {
                auth_provider: "facebook",
                token: response.accessToken,
                id: response.userID
            }
        );
        if (typeof props?.requestCallback === "function") {
            props.requestCallback((tokenResponse === false), tokenResponse);
        }
    }

    function onCLick() {
        fbContext.fb.login(function (response) {
            if (!response.authResponse) {
                return;
            }
            responseFacebook(response.authResponse);

        }, {scope: 'email'});
    }


    return (
        <div>
            {templateManager.render(
                <SocialButton buttonClass={props?.buttonClass || ''}
                              iconClass={<FontAwesomeIcon icon={faFacebookF}/>}
                              buttonLabel={props.buttonLabel}
                              onClick={onCLick}
                              id={'facebook'}
                />
            )}
        </div>
    );
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings
    };
}

AuthFacebook.category = 'auth';
AuthFacebook.templateId = 'authFacebook';
export default connect(
    mapStateToProps,
    null
)(AuthFacebook);
