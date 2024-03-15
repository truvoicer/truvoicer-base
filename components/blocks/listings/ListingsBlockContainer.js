import React, {useContext, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {isNotEmpty, isObject, isObjectEmpty, scrollToRef} from "../../../library/utils";
import {SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING} from "../../../redux/constants/session-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {INIT_SEARCH_REQUEST, PAGINATION_PAGE_SIZE} from "@/truvoicer-base/redux/constants/search-constants";
import {AppContext} from "@/truvoicer-base/config/contexts/AppContext";
import {AppManager} from "@/truvoicer-base/library/app/AppManager";

const ListingsBlockContainer = ({data, session, children}) => {
    const appContext = useContext(AppContext);
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const appManager = new AppManager(appContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    function validateData(data) {

    }
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
        if (searchContext?.searchOperation === INIT_SEARCH_REQUEST && searchContext.initialRequestHasRun) {
            return;
        }
        listingsManager.getListingsInitialLoad();
        console.log('listingsContext?.listingsData', listingsContext?.listingsData)
    }, [
        session,
        listingsContext?.listingsData,
        listingsContext?.listingsQueryData,
        searchContext?.pageControls[PAGINATION_PAGE_SIZE]
    ])
    useEffect(() => {
        if (searchContext?.searchOperation !== INIT_SEARCH_REQUEST && searchContext.initialRequestHasRun) {
            return;
        }
        if (!listingsManager.validateSearchParams()) {
            return;
        }
        // listingsManager.runSearch();
        return () => {
            listingsManager.getSearchEngine().updateContext({key: 'initialRequestHasRun', value: true})
        }
    }, [searchContext?.searchOperation])
    console.log(searchContext)
    useEffect(() => {
        if (!isObject(listingsContext?.listingsData) || isObjectEmpty(listingsContext?.listingsData)) {
            return;
        }
        const listingBlockId = listingsManager.getListingBlockId();
        if (!isNotEmpty(listingBlockId)) {
            return;
        }
        appManager.updateAppContexts({
            key: listingBlockId,
            value: {
                listingsContext: listingsContext,
                searchContext: searchContext,
            }
        })
    }, [listingsContext, searchContext])

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
