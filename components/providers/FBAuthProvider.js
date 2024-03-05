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
    const [fbAuthState, setFBAuthState] = useState({
        ...fbAuthContextData,
        update: updateState,
    });
    function handleCredentialResponse(response) {
        console.log({response});
        const data = {
            auth_provider: "facebook",
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
        if (!isNotEmpty(siteSettings?.facebook_app_id)) {
            return;
        }
        FB.init({
            appId            : siteSettings?.facebook_app_id,
            xfbml            : true,
            version          : 'v19.0'
        });
        console.log({FB})
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
