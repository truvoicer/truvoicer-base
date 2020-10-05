import React, {useEffect} from "react";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import {facebookAuthConfig} from "../../../config/facebook/facebookAuthConfig";
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "../../../redux/middleware/session-middleware";
import {buildWpApiUrl} from "../../../library/api/wp/middleware";
import SocialButton from "../Buttons/SocialButton";
import {wpApiConfig} from "../../../config/wp-api-config";

const AuthFacebook = (props) => {
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

    return (
        <FacebookLogin
            appId={facebookAuthConfig.appId}
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
    )
}
function mapStateToProps(state) {
    // console.log(state.session)
    return {
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    {getSessionTokenMiddleware}
)(AuthFacebook);