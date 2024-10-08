import React, {useContext, useEffect, useState} from 'react';
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {connect} from "react-redux";
import {getSessionTokenMiddleware} from "@/truvoicer-base/redux/middleware/session-middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {TwitterContext, twitterContextData} from "@/truvoicer-base/config/contexts/TwitterContext";

function TwitterProvider({children, siteSettings}) {

    const intentRegex = /twitter\.com\/intent\/(\w+)/,
        windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
        width = 550,
        height = 420,
        winHeight = (typeof screen !== 'undefined')? screen?.height : height,
        winWidth = (typeof screen !== 'undefined')? screen?.width : width;
    function updateState(data) {
        setTwitterState(modalState => {
            let cloneState = {...modalState};
            Object.keys(data).forEach((key) => {
                cloneState[key] = data[key];
            });
            return cloneState;
        })
    }
    function logout(id) {
    }

    function handleIntent(e) {
        e = e || window.event;
        let target = e.target || e.srcElement,
            m, left, top;

        while (target && target.nodeName.toLowerCase() !== 'a') {
            target = target.parentNode;
        }

        if (target && target.nodeName.toLowerCase() === 'a' && target.href) {
            m = target.href.match(intentRegex);
            if (m) {
                left = Math.round((winWidth / 2) - (width / 2));
                top = 0;

                if (winHeight > height) {
                    top = Math.round((winHeight / 2) - (height / 2));
                }

                window.open(target.href, 'intent', windowOptions + ',width=' + width +
                    ',height=' + height + ',left=' + left + ',top=' + top);
                e.returnValue = false;
                e.preventDefault && e.preventDefault();
            }
        }
    }
    const [twitterState, setTwitterState] = useState({
        ...twitterContextData,
        handleIntent: handleIntent,
        update: updateState,
        logout: logout
    });

    useEffect(() => {
        if (!isNotEmpty(siteSettings?.google_login_client_id)) {
            return;
        }
        if (typeof window === "undefined") {
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = () => {
            updateState({
                google: window.twttr
            })
        };
        script.onerror = () => {
            console.error('Error occurred while loading x script');
        };
        document.body.appendChild(script);


    }, [siteSettings.google_login_client_id]);
    return (
        <TwitterContext.Provider value={twitterState}>
            {children}
        </TwitterContext.Provider>
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
)(TwitterProvider);
