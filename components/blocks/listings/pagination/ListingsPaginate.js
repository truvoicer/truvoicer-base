import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {
    NEW_SEARCH_REQUEST,
    PAGINATION_PAGE_NUMBER,
    PAGINATION_TOTAL_PAGES, SEARCH_REQUEST_COMPLETED, SEARCH_REQUEST_STARTED,
} from "@/truvoicer-base/redux/constants/search-constants";
import GridItems from "../items/GridItems";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";
import {SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {getGridItemColumns} from "@/truvoicer-base/redux/actions/item-actions";

const ListingsPaginate = (props) => {
    const [paginationLimit, setPaginationLimit] = useState(10);
    const [paginationRange, setPaginationRange] = useState(4);

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const itemsContext = useContext(ListingsItemsContext);
    const listingsGrid = new ListingsGrid(listingsContext, searchContext);
    listingsGrid.setKeyMap(listingsContext?.listingsData?.keymap);
    const grid = listingsContext?.listingsGrid;

    const paginationClickHandler = (pageNumber) => {
        listingsManager.getSearchEngine().setSearchEntity('listingsPaginate');
        listingsManager.loadNextPageNumberMiddleware(pageNumber);
        listingsManager.getListingsEngine().setListingsScrollTopAction(true);
        listingsManager.searchEngine.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
    }


    const getPaginationRange = (currentPage) => {
        const pageControls = searchContext?.pageControls;
        let range = [];
        if (currentPage > paginationLimit - paginationRange) {
            for (let i = currentPage - paginationRange; i < currentPage; i++) {
                range.push(i)
            }
            for (let i = currentPage; i <= currentPage + paginationRange; i++) {
                if (i < pageControls[PAGINATION_TOTAL_PAGES]) {
                    range.push(i)
                }
            }
        } else {
            for (let i = 1; i <= paginationLimit; i++) {
                if (i < pageControls[PAGINATION_TOTAL_PAGES]) {
                    range.push(i)
                }
            }
        }
        return range;
    }

    const GetPagination = () => {
        const pageControls = searchContext?.pageControls;
        let range = getPaginationRange(pageControls[PAGINATION_PAGE_NUMBER]);
        console.log('range', range, pageControls, pageControls[PAGINATION_TOTAL_PAGES])
        return (
            <div className="paging">
                <ul className="pagination">
                    {pageControls[PAGINATION_PAGE_NUMBER] > paginationLimit - paginationRange &&
                    <li className="pagination--list-item">
                        <a
                            className={"pagination--list-item__a"}
                            onClick={() => {
                                listingsManager.searchEngine.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
                                paginationClickHandler(1)
                            }}
                        >
                            <span>1</span>
                        </a>
                    </li>
                    }
                    {range.map((num, index) => (
                        <React.Fragment key={index.toString()}>
                            {num === pageControls[PAGINATION_PAGE_NUMBER]
                                ?
                                <li className="pagination--list-item">
                                    <a className={"pagination--list-item__a active"}
                                       onClick={() => {
                                           listingsManager.searchEngine.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
                                           paginationClickHandler(num)
                                       }}><span>{num}</span></a>
                                </li>
                                :
                                <li className="pagination--list-item">
                                    <a className={"pagination--list-item__a "}
                                       onClick={paginationClickHandler.bind(this, num)}><span>{num}</span></a>
                                </li>
                            }
                        </React.Fragment>
                    ))}
                    {pageControls[PAGINATION_TOTAL_PAGES] > 0 &&
                    <>
                        <li className="pagination--list-item">
                            <span className="more-page">...</span>
                        </li>
                        <li className="pagination--list-item">
                            <a className={"pagination--list-item__a"}
                               onClick={paginationClickHandler.bind(this, pageControls[PAGINATION_TOTAL_PAGES])}>
                                <span>{pageControls[PAGINATION_TOTAL_PAGES]}</span>
                            </a>
                        </li>
                    </>
                    }
                </ul>
            </div>
        )
    }

    useEffect(() => {
        if (
            searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
            searchContext?.searchOperation === NEW_SEARCH_REQUEST &&
            searchContext?.searchEntity === 'listingsPaginate'
        ) {
            listingsManager.runSearch('listingsPaginate');
        }
    }, [searchContext?.searchOperation]);


        return (
            <>
                <Row>
                    {itemsContext.items.map((item, index) => (
                        <React.Fragment key={index}>
                            <Col {...getGridItemColumns(grid)}>
                                {listingsGrid.getGridItem(
                                    item,
                                    listingsContext?.listingsData?.[DISPLAY_AS],
                                    searchContext.category,
                                    grid,
                                    props.user[SESSION_USER_ID],
                                    index
                                )}
                            </Col>
                        </React.Fragment>
                    ))}
                </Row>
                <GetPagination/>
            </>
        )
}
ListingsPaginate.category = 'listings';
ListingsPaginate.templateId = 'listingsPaginate';
function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsPaginate);
