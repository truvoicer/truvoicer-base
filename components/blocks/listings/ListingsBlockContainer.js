import React, {useContext, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {setListingsBlocksDataAction} from "../../../redux/actions/page-actions";
import {isObject, isObjectEmpty, scrollToRef} from "../../../library/utils";
import {SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING} from "../../../redux/constants/session-constants";
import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/components/blocks/listings/contexts/SearchContext";
import {ItemContext} from "@/truvoicer-base/components/blocks/listings/contexts/ItemContext";
import {ListingsEngineBase} from "@/truvoicer-base/library/listings/engine/listings-engine-base";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const ListingsBlockContainer = ({data, session, listings, children}) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const itemContext = useContext(ItemContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext, itemContext);

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
        listingsManager.getListingsInitialLoad();
    }, [session, listingsContext?.listingsData])
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
