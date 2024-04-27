import React, {useContext, useEffect, useState} from 'react';
import {
    DISPLAY_AS,
    DISPLAY_AS_COMPARISONS,
    DISPLAY_AS_LIST,
    DISPLAY_AS_POST_LIST,
    DISPLAY_AS_SIDEBAR_LIST, DISPLAY_AS_SIDEBAR_POST,
    DISPLAY_AS_TILES,
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS,
    LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST,
    LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import ListingsBlockContainer from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import TileDisplay from "@/truvoicer-base/components/blocks/listings/display/TileDisplay";
import ListDisplay from "@/truvoicer-base/components/blocks/listings/display/ListDisplay";
import GridItems from "@/truvoicer-base/components/blocks/listings/items/GridItems";
import SidebarDisplay from "@/truvoicer-base/components/blocks/listings/display/SidebarDisplay";
import ComparisonDisplay from "@/truvoicer-base/components/blocks/listings/display/comparisons/ComparisonDisplay";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";

const ListingsBlockInterface = (props) => {
    const {data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const listingsGrid = new ListingsGrid();
    const loadListings = () => {
        if (!isNotEmpty(data?.[DISPLAY_AS])) {
            return false;
        }

        return  listingsGrid.getTemplateLayoutComponent({
            displayAs: data[DISPLAY_AS],
            category: searchContextState?.category,
            template: listingsContextState?.listingsData?.template,
            props: props
        });
    }

    function getExtraListingsData() {
        let extraData = {};
        if (isNotEmpty(data?.grid_layout)) {
            extraData = {
                listingsGrid: data.grid_layout
            }
        }
        return extraData;
    }

    const [listingsContextState, setListingsContextState] = useState({
        ...listingsData,
        ...getExtraListingsData(),
        updateData: ({key, value}) => {
            updateStateObject({
                key,
                value,
                setStateObj: setListingsContextState
            })
        },
        updateNestedObjectData: ({object, key, value}) => {
            updateStateNestedObjectData({
                object,
                key,
                value,
                setStateObj: setListingsContextState
            })
        },
    })

    const [searchContextState, setSearchContextState] = useState({
        ...searchData,
        updateData: ({key, value}) => {
            updateStateObject({
                key,
                value,
                setStateObj: setSearchContextState
            })
        },
        updateNestedObjectData: ({object, key, value}) => {
            updateStateNestedObjectData({
                object,
                key,
                value,
                setStateObj: setSearchContextState
            })
        },
    })

    return (
            <ListingsContext.Provider value={listingsContextState}>
                <SearchContext.Provider value={searchContextState}>
                    <ListingsBlockContainer data={data}>
                        <GridItems>
                            {loadListings()}
                        </GridItems>
                    </ListingsBlockContainer>
                </SearchContext.Provider>
            </ListingsContext.Provider>
    );
};
ListingsBlockInterface.category = 'listings';
ListingsBlockInterface.templateId = 'listingsBlockInterface';
export default ListingsBlockInterface;
