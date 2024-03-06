import React, {useContext} from "react";
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import {connect} from "react-redux";
import {buildWpApiUrl} from "../../../library/api/wp/middleware";
import SocialButton from "../Buttons/SocialButton";
import {wpApiConfig} from "../../../config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";
import {FbAuthContext} from "@/truvoicer-base/config/contexts/FacebookAuthContext";

const AuthFacebook = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const fbContext = useContext(FbAuthContext);
    const responseFacebook = (response) => {

        const data = {
            auth_provider: "facebook",
            token: response.accessToken
        }
        getSessionTokenMiddleware(buildWpApiUrl(wpApiConfig.endpoints.token), data, props.requestCallback)
    }
    const onFailure = (response) => {
        console.error(response);
    }

    function onCLick() {
        fbContext.fb.login(function(response) {
            if (!response.authResponse) {
                console.log('User cancelled login or did not fully authorize.');
                return;
            }
            responseFacebook(response.authResponse);
            // fbContext.fb.api('/me', {fields: 'name, email'}, function(response) {
            //     console.log({response})
            // });

        }, {scope: 'email'});
    }

    // console.log(props.siteSettings?.facebook_app_id)
    function defaultView() {
        return (
            <div>
                <SocialButton buttonClass={props.buttonClass}
                             iconClass={props.iconClass}
                             buttonLabel={props.buttonLabel}
                             onClick={onCLick}
                    />
            </div>
            // <FacebookLogin
            //     appId={props.siteSettings?.facebook_app_id}
            //     autoLoad={false}
            //     fields="name,email,picture"
            //     callback={responseFacebook}
            //     onFailure={onFailure}
            //     render={renderProps => <SocialButton buttonClass={props.buttonClass}
            //                                          iconClass={props.iconClass}
            //                                          buttonLabel={props.buttonLabel}
            //                                          onClick={renderProps.onClick}
            //     />}
            // />
        );
    }
    return templateManager.getTemplateComponent({
        category: 'auth',
        templateId: 'authFacebook',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            responseFacebook: responseFacebook,
            onFailure: onFailure,
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
