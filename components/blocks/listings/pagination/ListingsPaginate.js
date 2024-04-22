import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {
    NEW_SEARCH_REQUEST, PAGINATION_LAST_PAGE,
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
import ListingsItemsLoader from "@/truvoicer-base/components/blocks/listings/items/ListingsItemsLoader";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";

const ListingsPaginate = (props) => {
    const [padding, setPadding] = useState(2);
    const [pageNumber, setPageNumber] = useState(1);
    const searchParams = useSearchParams();

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const listingsGrid = new ListingsGrid(listingsContext, searchContext);
    listingsGrid.setKeyMap(listingsContext?.listingsData?.keymap);
    const grid = listingsContext?.listingsGrid;
    const lastPageNumber = getLastPageNumber();

    const paginationClickHandler = (pageNumber) => {
        listingsManager.getSearchEngine().setSearchEntity('listingsPaginate');
        listingsManager.loadNextPageNumberMiddleware(pageNumber);
        listingsManager.getListingsEngine().setListingsScrollTopAction(true);
        listingsManager.searchEngine.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
    }

    function getLastPageNumber() {
        return searchContext?.pageControls[PAGINATION_LAST_PAGE];
    }
    function getCurrentPageNumber() {
        const pageQueryVal = searchParams.get('page');
        if (pageQueryVal) {
            return parseInt(pageQueryVal);
        }
        const pageControls = searchContext?.pageControls;
        return pageControls[PAGINATION_PAGE_NUMBER];
    }

    const getpadding = (currentPage) => {
        const pageControls = searchContext?.pageControls;
        let range = [];
        if (currentPage >= pageControls?.last_page) {
            for (let i = currentPage - padding; i < currentPage; i++) {
                range.push(i)
            }
        } else if (currentPage <= 1) {
            for (let i = currentPage + 1; i < currentPage + padding + 1; i++) {
                range.push(i)
            }
        } else {
            for (let i = currentPage - padding; i <= currentPage; i++) {
                if (i > 1) {
                    range.push(i)
                }
            }
            for (let i = currentPage + 1; i < currentPage + padding + 1; i++) {
                if (i < pageControls?.last_page) {
                    range.push(i)
                }
            }
        }
        return range;
    }

    function getNextPageNumber() {
        const nextPageNumber = pageNumber + 1;
        if (nextPageNumber > lastPageNumber) {
            return lastPageNumber;
        }
        return nextPageNumber;
    }

    function getPreviousPageNumber() {
        const previousPageNumber = pageNumber - 1;
        if (previousPageNumber < 1) {
            return 1;
        }
        return previousPageNumber;
    }

    function getPageListItemProps(page) {
        return {
            className: page === pageNumber ? 'active' : ''
        }
    }

    function getPageLinkProps(page) {
        return {
            scroll: false,
            href: {
                query: {
                    page: page
                }
            },
            onClick: paginationClickHandler.bind(this, page)
        }
    }

    const nextPageNumber = getNextPageNumber();
    const previousPageNumber = getPreviousPageNumber();

    useEffect(() => {
        setPageNumber(getCurrentPageNumber());
    }, []);
    const GetPagination = () => {
        const pageControls = searchContext?.pageControls;
        let range = getpadding(pageNumber);
        return (
            <div className="paging">
                <ul className="pagination">

                    <li {...getPageListItemProps(1)}>
                        <Link
                            className={""}
                            {...getPageLinkProps(1)}
                        >
                            <span>1</span>
                        </Link>
                    </li>
                    {range[0] > padding &&
                        <li className="">
                            <Link
                                className={""}
                                {...getPageLinkProps(previousPageNumber)}>
                                <span>{'<<'}</span>
                            </Link>
                        </li>
                    }
                    {range.map((num, index) => (
                        <li key={index} {...getPageListItemProps(num)}>
                            <Link
                                className={""}
                                {...getPageLinkProps(num)}
                            >
                                <span>{num}</span>
                            </Link>
                        </li>
                    ))}
                    {range[range.length - 1] <= lastPageNumber - padding &&
                        <li className="">
                            <Link
                                {...getPageLinkProps(nextPageNumber)}
                            >
                                <span>{'>>'}</span>
                            </Link>
                        </li>
                    }
                    <li {...getPageListItemProps(pageControls?.[PAGINATION_LAST_PAGE])}>
                        <Link
                            {...getPageLinkProps(pageControls?.[PAGINATION_LAST_PAGE])}
                        >
                            <span>{pageControls?.[PAGINATION_LAST_PAGE]}</span>
                        </Link>
                    </li>
                    <li>
                        <span className="page-numbers">
                            {`Page ${pageNumber} of ${pageControls?.[PAGINATION_TOTAL_PAGES]}`}
                        </span>
                    </li>
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


    return templateManager.render(
        <ListingsItemsLoader>
            <GetPagination/>
        </ListingsItemsLoader>
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
