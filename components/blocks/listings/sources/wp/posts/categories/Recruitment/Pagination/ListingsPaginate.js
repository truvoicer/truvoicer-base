import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {
    NEW_SEARCH_REQUEST,
    PAGE_CONTROL_CURRENT_PAGE,
    PAGE_CONTROL_TOTAL_PAGES,
} from "@/truvoicer-base/redux/constants/search-constants";
import GridItems from "../../../../../../items/GridItems";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const ListingsPaginate = (props) => {
    const [paginationLimit, setPaginationLimit] = useState(10);
    const [paginationRange, setPaginationRange] = useState(4);

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const paginationClickHandler = (pageNumber) => {
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
        let range = getPaginationRange(pageControls[PAGE_CONTROL_CURRENT_PAGE]);
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="pagination_wrap">
                        <ul>

                            {pageControls[PAGE_CONTROL_CURRENT_PAGE] > paginationLimit - paginationRange &&
                            <li className="">
                                <a
                                    className={""}
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
                                    {num === pageControls[PAGE_CONTROL_CURRENT_PAGE]
                                        ?
                                        <li className="">
                                            <a className={"active"}
                                               onClick={() => {
                                                   listingsManager.searchEngine.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
                                                   paginationClickHandler(num)
                                               }}><span>{num}</span></a>
                                        </li>
                                        :
                                        <li className="">
                                            <a className={""}
                                               onClick={paginationClickHandler.bind(this, num)}><span>{num}</span></a>
                                        </li>
                                    }
                                </React.Fragment>
                            ))}
                            {pageControls[PAGE_CONTROL_TOTAL_PAGES] > 0 &&
                            <>
                                <li className="page-item">
                                    <span className="more-page">...</span>
                                </li>
                                <li className="">
                                    <a className={""}
                                       onClick={paginationClickHandler.bind(this, pageControls[PAGE_CONTROL_TOTAL_PAGES])}>
                                        <span>{pageControls[PAGE_CONTROL_TOTAL_PAGES]}</span>
                                    </a>
                                </li>
                            </>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (
            searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
            searchContext?.searchOperation === NEW_SEARCH_REQUEST
        ) {
            listingsManager.runSearch();
        }
    }, [searchContext?.searchOperation]);
    return (
        <>
            <GridItems/>
            <GetPagination/>
        </>
    )
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(ListingsPaginate);
