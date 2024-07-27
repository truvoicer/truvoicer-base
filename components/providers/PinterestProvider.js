import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {PinterestContext, pinterestContextData} from "@/truvoicer-base/config/contexts/PinterestContext";
import Script from "next/script";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

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
    function pin() {
        // window.PinUtils.pinAny();
        pinterestState.pinterest.pinAny();
    }

    const [pinterestState, setPinterestState] = useState({
        ...pinterestContextData,
        pin: pin,
        update: updateState,
    });
    useEffect(() => {
        if (!isNotEmpty(siteSettings?.facebook_app_id)) {
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://assets.pinterest.com/js/pinit.js';
        script.async = true;
        script.onload = () => {
            window.fbAsyncInit = function() {
                updateState({
                    pinterest: window.PinUtils
                })
            };
            script.onerror = () => {
                console.log('Error occurred while loading fb script');
            };
            document.body.appendChild(script);
        }

    }, [siteSettings.facebook_app_id]);

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
