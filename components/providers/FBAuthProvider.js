import React, {useContext, useEffect, useState} from 'react';
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {FbAuthContext, fbAuthContextData} from "@/truvoicer-base/config/contexts/FacebookAuthContext";

function FBAuthProvider({children, siteSettings}) {

    const modalContext = useContext(AppModalContext);
    function updateState(data) {
        setFBAuthState(modalState => {
            let cloneState = {...modalState};
            Object.keys(data).forEach((key) => {
                cloneState[key] = data[key];
            });
            return cloneState;
        })
    }
    function logout(id) {
        FB.getLoginStatus(function(response) {
            console.log('FB getLoginStatus', {response})
            FB.logout(function(response) {
               console.log('FB logout', {response})
            });
        });
    }
    const [fbAuthState, setFBAuthState] = useState({
        ...fbAuthContextData,
        update: updateState,
        logout: logout
    });

    useEffect(() => {
        if (!isNotEmpty(siteSettings?.facebook_app_id)) {
            return;
        }
        FB.init({
            appId            : siteSettings?.facebook_app_id,
            xfbml            : true,
            version          : 'v19.0'
        });

        updateState({
            appId: siteSettings?.facebook_app_id,
            fb: FB
        })

    }, [siteSettings.google_login_client_id]);
    return (
        <FbAuthContext.Provider value={fbAuthState}>
            {children}
        </FbAuthContext.Provider>
    );
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
    };
}

export default connect(
    mapStateToProps,
    null
)(FBAuthProvider);
