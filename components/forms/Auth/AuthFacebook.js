import React, {useContext} from "react";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "../../../redux/middleware/session-middleware";
import {buildWpApiUrl} from "../../../library/api/wp/middleware";
import SocialButton from "../Buttons/SocialButton";
import {wpApiConfig} from "../../../config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const AuthFacebook = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const responseFacebook = (response) => {

        const data = {
            custom_auth: "facebook",
            password: response.accessToken
        }
        props.getSessionTokenMiddleware(buildWpApiUrl(wpApiConfig.endpoints.token), data, props.requestCallback)
    }
    const onFailure = (response) => {
        console.error(response);
    }

    // console.log(props.siteSettings?.facebook_app_id)
    function defaultView() {
        return (
            <FacebookLogin
                appId={props.siteSettings?.facebook_app_id}
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
                onFailure={onFailure}
                render={renderProps => <SocialButton buttonClass={props.buttonClass}
                                                     iconClass={props.iconClass}
                                                     buttonLabel={props.buttonLabel}
                                                     onClick={renderProps.onClick}
                />}
            />
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
    {getSessionTokenMiddleware}
)(AuthFacebook);
