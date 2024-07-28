import React, {useContext, useEffect, useState} from 'react';
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {connect} from "react-redux";
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
        FB.getLoginStatus(function (response) {
            FB.logout(function (response) {

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
        if (typeof window === "undefined") {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.onload = () => {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: siteSettings?.facebook_app_id,
                    xfbml: true,
                    version: 'v19.0'
                });

                updateState({
                    appId: siteSettings?.facebook_app_id,
                    fb: window.FB
                })
            };
            script.onerror = () => {
                console.error('Error occurred while loading fb script');
            };
        }
        document.body.appendChild(script);

    }, [siteSettings.facebook_app_id]);

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
