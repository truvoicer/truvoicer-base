import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import ListingsItemsLoader from "../items/ListingsItemsLoader";

const ListingsInfiniteScroll = ({children}) => {

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
    const handleScroll = () => {
        const bottom =
          Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight - 200;
        if (bottom) {
            loadMore()
        //   setPage((prevPage) => {
        //     const nextPage = prevPage + 1;
        //     fetchData(nextPage);
        //     return nextPage;
        //   });
        }
      };
      
    //   useEffect(() => {
    //     window.addEventListener("scroll", handleScroll);
    //     return () => {
    //       window.removeEventListener("scroll", handleScroll);
    //     };
    //   }, []);

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
