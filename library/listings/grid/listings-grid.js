import {convertImageObjectsToArray, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {listingsGridConfig} from "@/config/listings-grid-config";
import React from "react";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

export class ListingsGrid {
    constructor(listingsContext, searchContext) {
        this.listingsManager = new ListingsManager(listingsContext, searchContext);
    }

    buildGridItemData({item, config}) {
        if (isObjectEmpty(config?.keyMap)) {
            console.warn("No keymap");
            return item;
        }
        const data = {};
        Object.keys(config.keyMap).forEach((key) => {
            const mapKey = config.keyMap[key];
            data[key] = item?.[mapKey];
        });
        return {...item, ...data};
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
        const buildData = this.buildGridItemData({item: gridItem, config: gridConfig[displayAs]});
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
