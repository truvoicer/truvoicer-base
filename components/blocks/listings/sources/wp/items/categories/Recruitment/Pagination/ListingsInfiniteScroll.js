import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import {
    APPEND_SEARCH_REQUEST,
    PAGINATION_PAGE_NUMBER,
    PAGE_CONTROL_HAS_MORE,
    SEARCH_REQUEST_COMPLETED, NEW_SEARCH_REQUEST, SEARCH_REQUEST_STARTED,
} from "@/truvoicer-base/redux/constants/search-constants";
import InfiniteScroll from 'react-infinite-scroller';
import LoaderComponent from "../../../../../../../../loaders/Loader";
import GridItems from "../../../../../../items/GridItems";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsInfiniteScroll = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const loadMore = () => {
        if (searchContext?.searchStatus !== SEARCH_REQUEST_COMPLETED) {
            return false;
        }
        console.log("ListingsInfiniteScroll.js: loadMore()", searchContext?.pageControls)
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(APPEND_SEARCH_REQUEST);
        listingsManager.getSearchEngine().loadNextPageNumberMiddleware(searchContext?.pageControls[PAGINATION_PAGE_NUMBER] + 1);
    }

    // useEffect(() => {
    //     if (
    //         searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
    //         searchContext?.searchOperation === APPEND_SEARCH_REQUEST
    //     ) {
    //         listingsManager.runSearch('ListingsInfiniteScroll');
    //     }
    // }, [searchContext?.searchOperation]);
    function defaultView() {
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
    return templateManager.getTemplateComponent({
        category: 'post_listings',
        templateId: 'listingsInfiniteScroll',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            loadMore: loadMore,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(ListingsInfiniteScroll);
