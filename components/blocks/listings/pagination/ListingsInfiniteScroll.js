import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { ListingsContext } from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import { SearchContext } from "@/truvoicer-base/library/listings/contexts/SearchContext";
import { ListingsManager } from "@/truvoicer-base/library/listings/listings-manager";
import { TemplateManager } from "@/truvoicer-base/library/template/TemplateManager";
import { TemplateContext } from "@/truvoicer-base/config/contexts/TemplateContext";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import { ListingsGrid } from "@/truvoicer-base/library/listings/grid/listings-grid";
import ListingsItemsLoader from "../items/ListingsItemsLoader";
import { BlockContext } from "../../contexts/BlockContext";
import { PAGE_CONTROL_HAS_MORE, PAGINATION_PAGE_NUMBER, SEARCH_REQUEST_APPEND, SEARCH_STATUS_COMPLETED } from "@/truvoicer-base/redux/constants/search-constants";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";

const ListingsInfiniteScroll = ({ children }) => {

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const blockContext = useContext(BlockContext);

    const listingsManager = new ListingsManager(listingsContext, searchContext)
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const itemsContext = useContext(ListingsItemsContext);
    const listingsGrid = new ListingsGrid();
    listingsGrid.setKeyMap(listingsContext?.listingsData?.keymap);
    const grid = listingsContext?.listingsGrid;

    const loadMore = (searchObj) => {
        if (!searchObj?.pageControls[PAGE_CONTROL_HAS_MORE]) {
            return false;
        }
        if (searchObj.pageControls.loading) {
            return false;
        }
        if (searchObj.searchStatus !== SEARCH_STATUS_COMPLETED) {
            return false;
        }

        listingsManager.getSearchEngine().updatePageControls({ key: 'loading', value: true });
        listingsManager.getSearchEngine().setSearchEntity('listingsInfiniteScroll');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_APPEND);
        listingsManager.loadNextPageNumberMiddleware(searchObj.pageControls[PAGINATION_PAGE_NUMBER] + 1);
    }
    const handleScroll = (searchObj, blockContext, listingsObj) => {
        const ele = blockContext?.ref?.current;
        const bottom = Math.ceil(ele.scrollTop) >= ele.scrollHeight - ele.clientHeight;
        if (bottom) {
            loadMore(searchObj, listingsObj);
        }
    };

    useEffect(() => {
        if (!blockContext?.ref?.current) {
            return;
        }
        let listener = (e) => {
            e.stopImmediatePropagation();
            handleScroll(searchContext, blockContext, listingsContext);
        };
        blockContext.ref.current.addEventListener("scroll", listener);
        return () => {
            if (!blockContext?.ref?.current) {
                return;
            }
            blockContext.ref.current.removeEventListener("scroll", listener);
        };
    }, [blockContext, searchContext, listingsContext]);
    return (
        <ListingsItemsLoader infiniteScroll={true}>
            {/* {searchContext?.pageControls?.loading && <LoaderComponent key={"loader"}/>} */}
            {searchContext?.pageControls?.loading && <p>Loading more...</p>}

            {!searchContext?.pageControls?.loading && searchContext?.pageControls[PAGE_CONTROL_HAS_MORE] && <p>Scroll down to load more...</p>}
        </ListingsItemsLoader>
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
