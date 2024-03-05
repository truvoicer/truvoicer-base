import React, {useContext, useEffect} from "react";
// import { GoogleLogin } from 'react-google-login';
import {connect} from "react-redux";
import {buildWpApiUrl} from "../../../library/api/wp/middleware";
import SocialButton from "../Buttons/SocialButton";
import {wpApiConfig} from "../../../config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";
import {GoogleAuthContext} from "@/truvoicer-base/config/contexts/GoogleAuthContext";

const AuthGoogle = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const gAuthContext = useContext(GoogleAuthContext);
    console.log({gAuthContext})
    const responseSuccess = (response) => {
        const data = {
            auth_provider: "google",
            password: response.tokenId
        }
        getSessionTokenMiddleware(buildWpApiUrl(wpApiConfig.endpoints.token), data, props.requestCallback)
    }
    const onClickHandler = (response) => {
        console.log({response});
    }
    useEffect(() => {
        gAuthContext.google.accounts.id.renderButton(document.getElementById("g-signin2"), {
            theme: 'outline',
            size: 'large',
            click_listener: onClickHandler
        });
    }, []);

    function defaultView() {
        return (
            <div id="g-signin2" data-onsuccess="onSignIn"></div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'auth',
        templateId: 'authGoogle',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            // responseFail: responseFail,
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
    null
)(AuthGoogle);
