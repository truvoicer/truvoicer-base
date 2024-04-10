import React, {useState} from 'react';
import {connect} from "react-redux";
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
    function pin() {
        window.PinUtils.pinAny();
        // pinterestContextData.pinterest.pinAny();
    }

    const [pinterestState, setPinterestState] = useState({
        ...pinterestContextData,
        pin: pin,
        update: updateState,
    });
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
