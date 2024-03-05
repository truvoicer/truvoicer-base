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
    const [googleAuthState, setGoogleAuthState] = useState({
        ...googleAuthContextData,
        update: updateState,
    });
    function handleCredentialResponse(response) {
        console.log({response});
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
        // {
        //     "clientId": "130270513031-852b16asasei5605at2et8he18rl7rgb.apps.googleusercontent.com",
        //     "client_id": "130270513031-852b16asasei5605at2et8he18rl7rgb.apps.googleusercontent.com",
        //     "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZmOTc3N2E2ODU5MDc3OThlZjc5NDA2MmMwMGI2NWQ2NmMyNDBiMWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMzAyNzA1MTMwMzEtODUyYjE2YXNhc2VpNTYwNWF0MmV0OGhlMThybDdyZ2IuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMzAyNzA1MTMwMzEtODUyYjE2YXNhc2VpNTYwNWF0MmV0OGhlMThybDdyZ2IuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk5ODIzOTA3MzAzODIxMTgxMTMiLCJlbWFpbCI6Im1pa3lkeGxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTcwOTY2NTgyMiwibmFtZSI6Ik1pY2hhZWwgVHJ1dm9pY2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTEM2a1lZTFVYcVN5bWtlbkI4RTB6NW9KdHEtbnJkb29YcGY2RVQzSUJVVU93PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik1pY2hhZWwiLCJmYW1pbHlfbmFtZSI6IlRydXZvaWNlIiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE3MDk2NjYxMjIsImV4cCI6MTcwOTY2OTcyMiwianRpIjoiZDhjZWFlZWI2NjllMWRlYjBlODY2ODY3MTk1ZjJhNTVkMzg2ZTk4MCJ9.HKlHY9EUFw4nhMJ8Fss3qOMXzCHBQxVDgYKm6vFm_UWz-xXD8lHWeHhcYpfgEj0-G8we689TFga6zi6ZbCV33Up2o3I_4uW2MMqn8ZLUKHtdCghLnCQClBCcR3TGxaXbTggTlr5iD9qDlSVpTJ39iWCsWqncnBw99Em-9G4zVxV210aJuAziOpgFw1y9Sz443nzvOdz42q2MKiMWsmSVpWmbe_rHQpJFEIjCQKp6hsQ6Z3M5PEFr0LKSTvfFOoWemA3I9MIdqwk14yK3WKATfCGsqMADkfQnDwfamgSBBRgO276DI4aDN9a98FLdtKmEoSJwm0MJnZWJP_rr-1MzlQ",
        //     "select_by": "btn_confirm"
        // }

    }
    useEffect(() => {
        if (!isNotEmpty(siteSettings?.google_login_client_id)) {
            return;
        }
        google.accounts.id.initialize({
            client_id: siteSettings?.google_login_client_id,
            callback: handleCredentialResponse
        });
        updateState({
            clientId: siteSettings?.google_login_client_id,
            google: google
        })

    }, [siteSettings.google_login_client_id]);
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
