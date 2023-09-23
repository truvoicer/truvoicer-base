import React, {useContext} from "react";
import {connect} from "react-redux";
import {
    APPEND_SEARCH_REQUEST,
    PAGE_CONTROL_CURRENT_PAGE,
    PAGE_CONTROL_HAS_MORE,
    SEARCH_REQUEST_COMPLETED,
} from "@/truvoicer-base/redux/constants/search-constants";
import InfiniteScroll from 'react-infinite-scroller';
import LoaderComponent from "../../../../../../../../widgets/Loader";
import GridItems from "../../../../../../items/GridItems";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const ListingsInfiniteScroll = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const loadMore = () => {
        if (searchContext?.searchStatus !== SEARCH_REQUEST_COMPLETED) {
            return false;
        }
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(APPEND_SEARCH_REQUEST);
        listingsManager.getSearchEngine().loadNextPageNumberMiddleware(searchContext?.pageControls[PAGE_CONTROL_CURRENT_PAGE] + 1);
    }

    return (
        <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={loadMore}
            hasMore={searchContext?.pageControls[PAGE_CONTROL_HAS_MORE]}
            loader={<LoaderComponent key={"loader"}/>}
        >
            <GridItems/>
        </InfiniteScroll>

    )
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(ListingsInfiniteScroll);
