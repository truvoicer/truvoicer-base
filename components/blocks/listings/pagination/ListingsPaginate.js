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

const ListingsPaginate = (props) => {
    const [paginationLimit, setPaginationLimit] = useState(10);
    const [paginationRange, setPaginationRange] = useState(4);

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const paginationClickHandler = (pageNumber) => {
        listingsManager.getSearchEngine().setSearchEntity('listingsPaginate');
        listingsManager.loadNextPageNumberMiddleware(pageNumber);
        listingsManager.getListingsEngine().setListingsScrollTopAction(true);
        listingsManager.searchEngine.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
    }


    const getPaginationRange = (currentPage) => {
        let range = [];
        if (currentPage > paginationLimit - paginationRange) {
            for (let i = currentPage - paginationRange; i < currentPage; i++) {
                range.push(i)
            }
            for (let i = currentPage; i <= currentPage + paginationRange; i++) {
                range.push(i)
            }
        } else {
            for (let i = 1; i <= paginationLimit; i++) {
                range.push(i)
            }
        }
        return range;
    }

    const GetPagination = () => {
        const pageControls = searchContext?.pageControls;
        let range = getPaginationRange(pageControls[PAGINATION_PAGE_NUMBER]);
        return (
            <div className="pagination">
                <ul>
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
    console.log({searchContext})
    function defaultView() {
        return (
            <>
                <GridItems
                    listStart={listingsContext?.listingsData?.list_start}
                    listEnd={listingsContext?.listingsData?.list_end}
                    customPosition={listingsContext?.listingsData?.custom_position}
                    grid={listingsContext?.listingsGrid}
                    listItems={searchContext?.searchList || []}
                />
                <GetPagination/>
            </>
        )
    }
    return templateManager.getTemplateComponent({
        category: 'listings',
        templateId: 'listingsPaginate',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            paginationLimit: paginationLimit,
            paginationRange: paginationRange,
            paginationClickHandler: paginationClickHandler,
            getPaginationRange: getPaginationRange,
            GetPagination: GetPagination,
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
)(ListingsPaginate);
