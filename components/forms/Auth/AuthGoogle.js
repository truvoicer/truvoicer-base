import React, {useContext} from "react";
// import { GoogleLogin } from 'react-google-login';
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "../../../redux/middleware/session-middleware";
import {buildWpApiUrl} from "../../../library/api/wp/middleware";
import SocialButton from "../Buttons/SocialButton";
import {wpApiConfig} from "../../../config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const AuthGoogle = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const responseSuccess = (response) => {
        const data = {
            custom_auth: "google",
            password: response.tokenId
        }
        props.getSessionTokenMiddleware(buildWpApiUrl(wpApiConfig.endpoints.token), data, props.requestCallback)
    }
    const responseFail = (response) => {
        console.error(response);
    }
    return null;
    function defaultView() {
        // return (
        //     <GoogleLogin
        //         clientId={props.siteSettings?.google_login_client_id}
        //         autoLoad={false}
        //         buttonText="Login with Google"
        //         onSuccess={responseSuccess}
        //         onFailure={responseFail}
        //         cookiePolicy={'single_host_origin'}
        //         render={renderProps => <SocialButton buttonClass={props.buttonClass}
        //                                              iconClass={props.iconClass}
        //                                              buttonLabel={props.buttonLabel}
        //                                              onClick={renderProps.onClick}
        //         />}
        //     />
        // );
    }
    return templateManager.getTemplateComponent({
        category: 'auth',
        templateId: 'authGoogle',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            responseFail: responseFail,
            responseSuccess: responseSuccess,
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
)(AuthGoogle);
