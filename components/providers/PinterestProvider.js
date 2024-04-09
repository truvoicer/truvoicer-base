import React, {useContext, useEffect, useState} from 'react';
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {PinterestContext, pinterestContextData} from "@/truvoicer-base/config/contexts/PinterestContext";

function PinterestProvider({children, siteSettings}) {

    function updateState(data) {
        setPinterestState(modalState => {
            let cloneState = {...modalState};
            Object.keys(data).forEach((key) => {
                cloneState[key] = data[key];
            });
            return cloneState;
        })
    }
    function logout(id) {
    }

    const [pinterestState, setPinterestState] = useState({
        ...pinterestContextData,
        update: updateState,
        logout: logout
    });

    useEffect(() => {
        console.log(window)
        // if (!isNotEmpty(siteSettings?.facebook_app_id)) {
        //     return;
        // }
        // window.twttr.ready(function() {
        //     updateState({
        //         // appId: siteSettings?.facebook_app_id,
        //         pinterest: window.twttr
        //     })
        // })

    }, []);
    return (
        <PinterestContext.Provider value={pinterestState}>
            {children}
        </PinterestContext.Provider>
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
)(PinterestProvider);
