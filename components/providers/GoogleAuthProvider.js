import React, {useContext, useEffect, useState} from 'react';
import {GoogleAuthContext, googleAuthContextData} from "@/truvoicer-base/config/contexts/GoogleAuthContext";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";
import {buildWpApiUrl} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";

function GoogleAuthProvider({children, siteSettings}) {

    const modalContext = useContext(AppModalContext);
    function updateState(data) {
        setGoogleAuthState(modalState => {
            let cloneState = {...modalState};
            Object.keys(data).forEach((key) => {
                cloneState[key] = data[key];
            });
            return cloneState;
        })
    }
    function logout(id) {
        google.accounts.id.revoke(id, done => {
            console.log('revoke done:', done);
        });
    }
    const [googleAuthState, setGoogleAuthState] = useState({
        ...googleAuthContextData,
        update: updateState,
        logout: logout
    });
    function handleCredentialResponse(response) {
        const data = {
            auth_provider: "google",
            token: response.credential
        }
        getSessionTokenMiddleware(wpApiConfig.endpoints.auth.login,
            data,
            (error, data) => {
                if (error) {
                    console.log({error})
                    updateState({
                        errors: [data?.message]
                    })
                    return;
                }
                modalContext.showModal({show: false})
            }
        )

    }
    useEffect(() => {
        if (!isNotEmpty(siteSettings?.google_login_client_id)) {
            return;
        }
        if (typeof window === "undefined") {
            return;
        }
        if (typeof window.google === "undefined") {
            return;
        }
        window.google.accounts.id.initialize({
            client_id: siteSettings?.google_login_client_id,
            callback: handleCredentialResponse
        });
        updateState({
            clientId: siteSettings?.google_login_client_id,
            google: window.google
        })

    }, [siteSettings.google_login_client_id,]);
    return (
        <GoogleAuthContext.Provider value={googleAuthState}>
            {children}
        </GoogleAuthContext.Provider>
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
)(GoogleAuthProvider);
