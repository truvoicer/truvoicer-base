import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    SEARCH_REQUEST_NEW,
    PAGINATION_PAGE_NUMBER,
    PAGINATION_TOTAL_PAGES, SEARCH_STATUS_COMPLETED, SEARCH_STATUS_STARTED,
    PAGE_CONTROL_HAS_MORE,
} from "@/truvoicer-base/redux/constants/search-constants";
import GridItems from "../items/GridItems";
import { SearchContext } from "@/truvoicer-base/library/listings/contexts/SearchContext";
import { ListingsContext } from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import { ListingsManager } from "@/truvoicer-base/library/listings/listings-manager";
import { TemplateManager } from "@/truvoicer-base/library/template/TemplateManager";
import { TemplateContext } from "@/truvoicer-base/config/contexts/TemplateContext";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ListingsGrid } from "@/truvoicer-base/library/listings/grid/listings-grid";
import { DISPLAY_AS } from "@/truvoicer-base/redux/constants/general_constants";
import { SESSION_USER, SESSION_USER_ID } from "@/truvoicer-base/redux/constants/session-constants";
import { getGridItemColumns } from "@/truvoicer-base/redux/actions/item-actions";
import InfiniteScroll from "react-infinite-scroller";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";

const ListingsItemsLoader = ({
    user,
    children,
    containerComponent = null,
    containerItemComponent = null,
    infiniteScroll = false,
}) => {

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const itemsContext = useContext(ListingsItemsContext);
    const listingsGrid = new ListingsGrid();
    listingsGrid.setKeyMap(listingsContext?.listingsData?.keymap);
    const grid = listingsContext?.listingsGrid;

    function getContainerComponent() {
        if (!containerComponent) {
            return Row;
        }
        return containerComponent;
    }

    function getContainerItemComponent() {
        if (!containerItemComponent) {
            return Col;
        }
        return containerItemComponent;
    }

    function renderListItems() {
        return itemsContext.items.map((item, index) => {
            let cloneGridItemObj = { ...gridItemsProps };
            cloneGridItemObj.category = listingsManager.getCategory(item);
            return (
                <ContainerItemComponent key={index} {...getGridItemColumns(grid)}>
                    {listingsGrid.getGridItem({
                        ...cloneGridItemObj,
                        ...{
                            item,
                            index
                        }
                    })}
                </ContainerItemComponent>
            )
        })
    }

    const loadMore = () => {
        listingsManager.getSearchEngine().setSearchEntity('listingsPaginate');
        listingsManager.loadNextPageNumberMiddleware(searchContext.pageControls[PAGINATION_PAGE_NUMBER] + 1);
        listingsManager.searchEngine.setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
    }

    function getContainerProps() {
        return {
            style: {
                width: listingsContext?.listingsData?.container_width || 'auto',
                height: listingsContext?.listingsData?.container_height || 'auto',
            }
        }
    }

    function renderInfiniteScroll() {
        return (
            <div className="listings--block listings--block--infinite-scroll"
                {...getContainerProps()}>
                <InfiniteScroll
                    pageStart={0}
                    initialLoad={false}
                    loadMore={loadMore}
                    hasMore={searchContext.pageControls[PAGE_CONTROL_HAS_MORE]}
                    loader={templateManager.render(<LoaderComponent key={"loader"} />)}
                >
                    <ContainerComponent>
                        {renderListItems()}
                    </ContainerComponent>
                </InfiniteScroll>
            </div>
        );
    }

    function renderDefault() {
        return (
            <ContainerComponent>
                {renderListItems()}
            </ContainerComponent>
        );
    }


    const ContainerComponent = getContainerComponent();
    const ContainerItemComponent = getContainerItemComponent();

    let gridItemsProps = {
        displayAs: listingsContext?.listingsData?.[DISPLAY_AS],
        listingsGrid: grid,
        userId: user[SESSION_USER_ID],
    }
    return (
        <>
            {infiniteScroll
                ? renderInfiniteScroll()
                : renderDefault()
            }

            {children ? children : null}
        </>
    )
}
ListingsItemsLoader.category = 'listings';
ListingsItemsLoader.templateId = 'listingsItemsLoader';

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsItemsLoader);
