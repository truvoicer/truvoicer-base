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
import { DISPLAY_AS, STYLE, TEMPLATE } from "@/truvoicer-base/redux/constants/general_constants";
import { SESSION_USER, SESSION_USER_ID } from "@/truvoicer-base/redux/constants/session-constants";
import { getGridItemColumns } from "@/truvoicer-base/redux/actions/item-actions";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import ListingsInfiniteScroll from "../pagination/ListingsInfiniteScroll";

const ListingsItemsLoader = ({
    user,
    children,
    containerComponent = null,
    containerItemComponent = null,
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
        style: listingsContext?.listingsData?.[STYLE],
        template: listingsContext?.listingsData?.[TEMPLATE],
        listingsGrid: grid,
        userId: user[SESSION_USER_ID],
    }
    return (
        <>
            {renderDefault()}

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
