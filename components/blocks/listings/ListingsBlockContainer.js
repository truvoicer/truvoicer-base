import React, {useContext, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {isObject, isObjectEmpty, scrollToRef} from "../../../library/utils";
import {SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING} from "../../../redux/constants/session-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {PAGE_CONTROL_PAGE_SIZE} from "@/truvoicer-base/redux/constants/search-constants";

const ListingsBlockContainer = ({data, session, children}) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    useEffect(() => {
        if (!session[SESSION_IS_AUTHENTICATING]) {
            let cloneData = {...data}
            if (Array.isArray(cloneData?.listings_category_id)) {
                cloneData.listings_category = cloneData.listings_category_id[0]?.slug
            }
            listingsManager.setListingsBlocksDataAction(cloneData)
        }
    }, [session])

    useEffect(() => {
        if (session[SESSION_IS_AUTHENTICATING]) {
            return;
        }
        if (!isObject(listingsContext?.listingsData) || isObjectEmpty(listingsContext?.listingsData)) {
            return;
        }
        if (!Array.isArray(listingsContext?.listingsData?.providers)) {
            return;
        }
        listingsManager.initialisePageControls();
        if (!searchContext?.pageControls[PAGE_CONTROL_PAGE_SIZE]) {
            return;
        }
        listingsManager.getListingsInitialLoad();
    }, [
        session,
        listingsContext?.listingsData,
        searchContext?.pageControls[PAGE_CONTROL_PAGE_SIZE]
    ])

    const myRef = useRef(null)
    if (listingsContext?.listingsScrollTop) {
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
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsBlockContainer);
