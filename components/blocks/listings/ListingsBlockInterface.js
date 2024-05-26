import React, {useContext, useEffect, useState} from 'react';
import {
    DISPLAY_AS,
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import ListingsBlockContainer from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import GridItems from "@/truvoicer-base/components/blocks/listings/items/GridItems";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";

const ListingsBlockInterface = (props) => {
    const {data} = props;

    const listingsGrid = new ListingsGrid();

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

    function getListingService() {
        switch (listingsContextState?.listingsData?.source) {
            case 'api':
                return data?.api_listings_service;
            case 'wordpress':
                return data?.listings_category;
            default:
                return null;
        }
    }
    const loadListings = () => {
        if (!isNotEmpty(data?.[DISPLAY_AS])) {
            return null;
        }
        const service = getListingService();
        if (!service) {
            return null;
        }
        const layoutCompoent =  listingsGrid.getTemplateListingComponent({
            displayAs: data[DISPLAY_AS],
            category: service,
            template: data?.template,
            component: 'layout',
            props: props
        });

        if (!layoutCompoent) {
            console.log(data)
            console.warn(`No layout component found for display as: ${data[DISPLAY_AS]} | category: ${service}`);
            return null
        }
        return layoutCompoent;
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

console.log(data)
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
