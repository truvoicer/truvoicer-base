import React, {useContext, useEffect, useState} from 'react';
import {GoogleAuthContext, googleAuthContextData} from "@/truvoicer-base/config/contexts/GoogleAuthContext";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";
import {buildWpApiUrl} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";

function GoogleAuthProvider({children, siteSettings, page}) {

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

        });
    }
    const [googleAuthState, setGoogleAuthState] = useState({
        ...googleAuthContextData,
        update: updateState,
        logout: logout
    });
    async function handleCredentialResponse(response) {
        console.log('response', response);
        const tokenResponse = await getSessionTokenMiddleware(
            wpApiConfig.endpoints.auth.login,
            {
                auth_provider: "google",
                token: response.credential
            }
        );
        if (!tokenResponse) {
            updateState({
                errors: ['Error']
            })
            return;
        }
        modalContext.showModal({show: false})
    }

    useEffect(() => {
        if (!isNotEmpty(siteSettings?.google_login_client_id)) {
            return;
        }
        if (typeof window === "undefined") {
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: siteSettings?.google_login_client_id,
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: true
            });
            updateState({
                clientId: siteSettings?.google_login_client_id,
                google: window.google
            })
        };
        script.onerror = () => {
            console.error('Error occurred while loading script');
        };
        document.body.appendChild(script);


    }, [siteSettings.google_login_client_id]);
    return (
        <GoogleAuthContext.Provider value={googleAuthState}>
            {children}
        </GoogleAuthContext.Provider>
    );
}

function mapStateToProps(state) {
    return {
        page: state.page,
        siteSettings: state.page.siteSettings,
    };
}

export default connect(
    mapStateToProps,
    null
)(GoogleAuthProvider);
