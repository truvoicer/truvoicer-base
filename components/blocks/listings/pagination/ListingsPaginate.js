import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {
    SEARCH_REQUEST_NEW, PAGINATION_LAST_PAGE,
    PAGINATION_PAGE_NUMBER, PAGINATION_PAGE_SIZE, PAGINATION_TOTAL_ITEMS,
    PAGINATION_TOTAL_PAGES,
} from "@/truvoicer-base/redux/constants/search-constants";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import {SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import ListingsItemsLoader from "@/truvoicer-base/components/blocks/listings/items/ListingsItemsLoader";
import Link from "next/link";
import {useSearchParams} from "next/navigation";

const ListingsPaginate = (props) => {
    const {
        containerComponent = null,
        containerItemComponent = null,
        showIndicator = true,
    } = props;
    const [padding, setPadding] = useState(2);
    const [pageNumber, setPageNumber] = useState(1);
    const searchParams = useSearchParams();

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const listingsGrid = new ListingsGrid();
    listingsGrid.setKeyMap(listingsContext?.listingsData?.keymap);
    const lastPageNumber = getLastPageNumber();

    const paginationClickHandler = (e, pageNumber) => {
        if (!listingsManager.listingsEngine.isPrimaryListing()) {
            e.preventDefault();
        }
        listingsManager.getSearchEngine().setSearchEntity('listingsPaginate');
        listingsManager.loadNextPageNumberMiddleware(pageNumber);
        listingsManager.getListingsEngine().setListingsScrollTopAction(true);
        listingsManager.searchEngine.setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
    }

    function getLastPageNumber() {
        if (searchContext?.pageControls[PAGINATION_LAST_PAGE]) {
            return searchContext?.pageControls[PAGINATION_LAST_PAGE];
        }
        if (searchContext?.pageControls[PAGINATION_TOTAL_PAGES] && searchContext?.pageControls[PAGINATION_TOTAL_ITEMS]) {
            const calculate = Math.ceil(searchContext?.pageControls[PAGINATION_TOTAL_ITEMS] / searchContext?.pageControls[PAGINATION_PAGE_SIZE]);
            return calculate;
        }
        return 1;
    }
    function getCurrentPageNumber() {
        const pageQueryVal = searchParams.get('page');
        if (listingsManager.listingsEngine.isPrimaryListing() && pageQueryVal) {
            return parseInt(pageQueryVal);
        }
        const pageControls = searchContext?.pageControls;
        return pageControls[PAGINATION_PAGE_NUMBER];
    }

    const getpadding = (currentPage) => {
        let right = [];
        let left = [];
        if (currentPage >= lastPageNumber) {
            right = [];
            for (let i = currentPage - padding; i < currentPage; i++) {
                if (i > 1 && i < lastPageNumber) {
                    left.push(i)
                }
            }
        } else if (currentPage <= 1) {
            left = [];
            for (let i = currentPage + 1; i < currentPage + padding + 1; i++) {
                if (i > 1 && i < lastPageNumber) {
                    right.push(i)
                }
            }
        } else {
            for (let i = currentPage - padding; i <= currentPage; i++) {
                if (i > 1 && i < lastPageNumber) {
                    left.push(i)
                }
            }
            for (let i = currentPage + 1; i < currentPage + padding + 1; i++) {
                if (i > 1 && i < lastPageNumber) {
                    right.push(i)
                }
            }
        }
        return {
            left,
            right
        };
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
            onClick: (e) => {
                paginationClickHandler(e, page)
            }
        }
    }

    useEffect(() => {
        setPageNumber(getCurrentPageNumber());
    }, [searchContext?.pageControls?.[PAGINATION_PAGE_NUMBER]]);
    
    const GetPagination = () => {
        let {left, right} = getpadding(pageNumber);
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
                    {left.map((num, index) => (
                        <li key={index} {...getPageListItemProps(num)}>
                            <Link
                                className={""}
                                {...getPageLinkProps(num)}
                            >
                                <span>{num}</span>
                            </Link>
                        </li>
                    ))}
                    {right.map((num, index) => (
                        <li key={index} {...getPageListItemProps(num)}>
                            <Link
                                className={""}
                                {...getPageLinkProps(num)}
                            >
                                <span>{num}</span>
                            </Link>
                        </li>
                    ))}
                    {lastPageNumber > 1 &&
                        <li {...getPageListItemProps(lastPageNumber)}>
                            <Link
                                {...getPageLinkProps(lastPageNumber)}
                            >
                                <span>{lastPageNumber}</span>
                            </Link>
                        </li>
                    }
                    {showIndicator &&
                        <li>
                            <span className="page-numbers">
                                {`Page ${pageNumber} of ${lastPageNumber}`}
                            </span>
                        </li>
                    }
                </ul>
            </div>
        )
    }

    return templateManager.render(
        <ListingsItemsLoader
            containerComponent={containerComponent}
            containerItemComponent={containerItemComponent}>
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
