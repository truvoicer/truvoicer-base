import React, {useContext, useState} from 'react';
import {connect} from "react-redux";
import {GoogleAuthContext} from "@/truvoicer-base/config/contexts/GoogleAuthContext";
import {FbAuthContext} from "@/truvoicer-base/config/contexts/FacebookAuthContext";
import {SessionContext, sessionContextData} from "@/truvoicer-base/config/contexts/SessionContext";

function SessionLayout({session, children}) {
    const gAuthContext = useContext(GoogleAuthContext);
    const fbContext = useContext(FbAuthContext);

    function logout(sessionUser) {
        console.log('logout', {sessionUser})
        switch (sessionUser?.auth_provider) {
            case 'google':
                gAuthContext.logout(sessionUser?.auth_provider_user_id);
                break;
            case 'facebook':
                fbContext.logout(sessionUser?.auth_provider_user_id);
                break;
        }
    }

    const [sessionContextState, setSessionContextState] = useState({
        ...sessionContextData,
        logout: logout
    })
    console.log(1, {session})
    return (
        <SessionContext.Provider value={sessionContextState}>
            {children}
        </SessionContext.Provider>
    );
}

function mapStateToProps(state) {
    return {
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(SessionLayout);
