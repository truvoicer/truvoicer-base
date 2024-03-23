import {convertImageObjectsToArray, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {listingsGridConfig} from "@/config/listings-grid-config";
import React from "react";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {mapDataToKeymap} from "@/truvoicer-base/library/helpers/wp-helpers";

export class ListingsGrid {
    keyMap = null;
    constructor(listingsContext, searchContext) {
        this.listingsManager = new ListingsManager(listingsContext, searchContext);
    }

    setKeyMap(keyMap) {
        this.keyMap = keyMap;
    }

    getGridItem(item, displayAs, category, listingsGrid, userId, showInfoCallback, index = false) {
        let gridItem = {...item};
        if (isSet(gridItem.image_list)) {
            gridItem.image_list = convertImageObjectsToArray(gridItem.image_list);
        }
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[displayAs])) {
            console.warn("No grid config for displayAs", displayAs);
            return null;
        }
        if (!isSet(gridConfig[displayAs][listingsGrid])) {
            console.warn("No grid config for displayAs", displayAs, "and grid", listingsGrid);
            return null;
        }
        const GridItems = gridConfig[displayAs][listingsGrid];
        const buildData = mapDataToKeymap({item, gridItem, keymap: this.keyMap});
        return (
            <GridItems
                index={index}
                data={buildData}
                searchCategory={category}
                showInfoCallback={showInfoCallback}
            />
        )
    }
}
