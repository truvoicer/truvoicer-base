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
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {getGridItemColumns} from "@/truvoicer-base/redux/actions/item-actions";
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";
import {SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";

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
        // if (searchContext.searchStatus !== SEARCH_REQUEST_COMPLETED) {
        //     return false;
        // }
        // listingsManager.getSearchEngine().setSearchEntity('listingsInfiniteScroll');
        // listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(APPEND_SEARCH_REQUEST);
        // listingsManager.loadNextPageNumberMiddleware(searchContext.pageControls[PAGINATION_PAGE_NUMBER] + 1);
    }

    useEffect(() => {
        if (
            searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
            searchContext?.searchOperation === APPEND_SEARCH_REQUEST &&
            searchContext?.searchEntity === 'listingsInfiniteScroll' &&
            searchContext.query[PAGINATION_PAGE_NUMBER] > searchContext.pageControls[PAGINATION_PAGE_NUMBER]
        ) {
            // listingsManager.runSearch('ListingsInfiniteScroll');
        }
    }, [searchContext?.searchOperation]);


    return (
        <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={loadMore}
            hasMore={searchContext.pageControls[PAGE_CONTROL_HAS_MORE]}
            loader={templateManager.render(<LoaderComponent key={"loader"}/>)}
        >
            <Row>
                {/*{itemsContext.items.map((item, index) => (*/}
                {/*    <React.Fragment key={index}>*/}
                {/*        <Col {...getGridItemColumns(grid)}>*/}
                {/*            {listingsGrid.getGridItem({*/}
                {/*                item,*/}
                {/*                displayAs: listingsContext?.listingsData?.[DISPLAY_AS],*/}
                {/*                category: searchContext.category,*/}
                {/*                listingsGrid: grid,*/}
                {/*                userId: props.user[SESSION_USER_ID],*/}
                {/*                index*/}
                {/*            })}*/}
                {/*        </Col>*/}
                {/*    </React.Fragment>*/}
                {/*))}*/}
            </Row>
        </InfiniteScroll>

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
