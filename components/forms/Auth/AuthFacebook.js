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
    const responseFacebook = (response) => {
        console.log('fb res', {response});
        const data = {
            auth_provider: "facebook",
            token: response.accessToken,
            id: response.userID
        }
        getSessionTokenMiddleware(wpApiConfig.endpoints.auth.login, data, props.requestCallback)
    }

    function onCLick() {
        fbContext.fb.login(function(response) {
            if (!response.authResponse) {
                console.log('User cancelled login or did not fully authorize.');
                return;
            }
            responseFacebook(response.authResponse);

        }, {scope: 'email'});
    }

    function defaultView() {
        return (
            <div>
                <SocialButton buttonClass={props.buttonClass}
                             iconClass={<FontAwesomeIcon icon={faFacebookF} />}
                             buttonLabel={props.buttonLabel}
                             onClick={onCLick}
                    />
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'auth',
        templateId: 'authFacebook',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            responseFacebook: responseFacebook,
            ...props
        }
    });
}
function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings
    };
}

export default connect(
    mapStateToProps,
    null
)(AuthFacebook);
