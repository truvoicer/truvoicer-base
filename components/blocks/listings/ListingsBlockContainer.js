import React, {useEffect, useRef} from "react";
import {connect} from "react-redux";
import {setListingsBlocksDataAction} from "../../../redux/actions/page-actions";
import {scrollToRef} from "../../../library/utils";
import {SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING} from "../../../redux/constants/session-constants";

const ListingsBlockContainer = ({data, session, listings, children}) => {
    useEffect(() => {
        if (!session[SESSION_IS_AUTHENTICATING]) {
            setListingsBlocksDataAction(data)
        }
    }, [session])
    const myRef = useRef(null)
    if (listings.listingsScrollTop) {
        scrollToRef(myRef)
    }
    return (
        <div ref={myRef}>
            {children}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        listings: state.listings,
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsBlockContainer);
