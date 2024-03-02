import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import {
    APPEND_SEARCH_REQUEST, NEW_SEARCH_REQUEST,
    PAGINATION_PAGE_NUMBER,
    PAGE_CONTROL_HAS_MORE,
    SEARCH_REQUEST_COMPLETED, SEARCH_REQUEST_STARTED,
} from "@/truvoicer-base/redux/constants/search-constants";
import InfiniteScroll from 'react-infinite-scroller';
import LoaderComponent from "../../../loaders/Loader";
import GridItems from "../items/GridItems";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsInfiniteScroll = (props) => {

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);

    const listingsManager = new ListingsManager(listingsContext, searchContext)
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const loadMore = () => {
        console.log("ListingsInfiniteScroll.js: loadMore()")
        if (searchContext.searchStatus !== SEARCH_REQUEST_COMPLETED) {
            return false;
        }
        listingsManager.getSearchEngine().setSearchEntity('listingsInfiniteScroll');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(APPEND_SEARCH_REQUEST);
        listingsManager.loadNextPageNumberMiddleware(searchContext.pageControls[PAGINATION_PAGE_NUMBER] + 1);
    }

    // useEffect(() => {
    //     if (
    //         searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
    //         searchContext?.searchOperation === APPEND_SEARCH_REQUEST &&
    //         searchContext?.searchEntity === 'listingsInfiniteScroll'
    //     ) {
    //         listingsManager.runSearch('ListingsInfiniteScroll');
    //     }
    // }, [searchContext?.searchOperation]);
    console.log("ListingsInfiniteScroll.js: searchContext", searchContext)

    function defaultView() {
        return (
            <InfiniteScroll
                pageStart={0}
                initialLoad={false}
                loadMore={loadMore}
                hasMore={searchContext.pageControls[PAGE_CONTROL_HAS_MORE]}
                loader={<LoaderComponent key={"loader"}/>}
            >
                <GridItems
                    listStart={listingsContext?.listingsData?.list_start}
                    listEnd={listingsContext?.listingsData?.list_end}
                    customPosition={listingsContext?.listingsData?.custom_position}
                    grid={listingsContext?.listingsGrid}
                    listItems={searchContext?.searchList || []}
                />
            </InfiniteScroll>

        )
    }
    return templateManager.getTemplateComponent({
        category: 'listings',
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
