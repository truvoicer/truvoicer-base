import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import {
    SEARCH_REQUEST_APPEND, SEARCH_REQUEST_NEW,
    PAGINATION_PAGE_NUMBER,
    PAGE_CONTROL_HAS_MORE,
    SEARCH_STATUS_COMPLETED, SEARCH_STATUS_STARTED,
} from "@/truvoicer-base/redux/constants/search-constants";
import InfiniteScroll from 'react-infinite-scroller';
import LoaderComponent from "../../../loaders/Loader";
import GridItems from "../items/GridItems";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {getGridItemColumns} from "@/truvoicer-base/redux/actions/item-actions";
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";
import {SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import ListingsItemsLoader from "../items/ListingsItemsLoader";

const ListingsInfiniteScroll = (props) => {

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);

    const listingsManager = new ListingsManager(listingsContext, searchContext)
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const itemsContext = useContext(ListingsItemsContext);
    const listingsGrid = new ListingsGrid();
    listingsGrid.setKeyMap(listingsContext?.listingsData?.keymap);
    const grid = listingsContext?.listingsGrid;

    const loadMore = () => {
        // if (searchContext.searchStatus !== SEARCH_STATUS_COMPLETED) {
        //     return false;
        // }
        // listingsManager.getSearchEngine().setSearchEntity('listingsInfiniteScroll');
        // listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_APPEND);
        // listingsManager.loadNextPageNumberMiddleware(searchContext.pageControls[PAGINATION_PAGE_NUMBER] + 1);
    }

    useEffect(() => {
        if (
            searchContext?.searchStatus !== SEARCH_STATUS_STARTED &&
            searchContext?.searchOperation === SEARCH_REQUEST_APPEND &&
            searchContext?.searchEntity === 'listingsInfiniteScroll' &&
            searchContext.query[PAGINATION_PAGE_NUMBER] > searchContext.pageControls[PAGINATION_PAGE_NUMBER]
        ) {
            // listingsManager.runSearch('ListingsInfiniteScroll');
        }
    }, [searchContext?.searchOperation]);


    return (
        <ListingsItemsLoader infiniteScroll={true}/>
    )
}

function mapStateToProps(state) {
    return {
        user: state.session.user
    };
}

ListingsInfiniteScroll.category = 'listings';
ListingsInfiniteScroll.templateId = 'listingsInfiniteScroll';
export default connect(
    mapStateToProps,
    null
)(ListingsInfiniteScroll);
