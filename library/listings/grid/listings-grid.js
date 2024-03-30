import {convertImageObjectsToArray, findInObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {listingsGridConfig} from "@/truvoicer-base/config/listings-grid-config";
import React from "react";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {mapDataToKeymap} from "@/truvoicer-base/library/helpers/wp-helpers";
import {templateConfig} from "@/config/template-config";

export class ListingsGrid {
    keyMap = null;
    constructor(listingsContext, searchContext) {
        this.listingsManager = new ListingsManager(listingsContext, searchContext);
    }

    setKeyMap(keyMap) {
        this.keyMap = keyMap;
    }

    buildTemplateConfigIdentifier(displayAs, category, listingsGrid) {
        return `listings.grid.${displayAs}.${category}.${listingsGrid}`;
    }
    findTemplateGridItemComponent(displayAs, category, listingsGrid) {
        const gridConfig = templateConfig();
        return findInObject(
            this.buildTemplateConfigIdentifier(displayAs, category, listingsGrid),
            gridConfig
        );
    }
    findDefaultGridItemComponent(displayAs, category, listingsGrid) {
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[displayAs])) {
            console.warn("No grid config for displayAs", displayAs);
            return null;
        }
        if (!isSet(gridConfig[displayAs][listingsGrid])) {
            console.warn("No grid config for displayAs", displayAs, "and grid", listingsGrid);
            return null;
        }
        return gridConfig[displayAs][listingsGrid];
    }

    getGridItem(item, displayAs, category, listingsGrid, userId, showInfoCallback, index = false) {
        let gridItem = {...item};
        if (isSet(gridItem.image_list)) {
            gridItem.image_list = convertImageObjectsToArray(gridItem.image_list);
        }
        const buildData = mapDataToKeymap({item, gridItem, keymap: this.keyMap});

        let GridItemComponent = this.findTemplateGridItemComponent(displayAs, category, listingsGrid);
        if (!GridItemComponent) {
            GridItemComponent = this.findDefaultGridItemComponent(displayAs, category, listingsGrid);
        }
        if (!GridItemComponent) {
            console.warn("No grid item component found for", displayAs, category, listingsGrid);
            return null;
        }

        return (
            <GridItemComponent
                index={index}
                data={buildData}
                searchCategory={category}
                showInfoCallback={showInfoCallback}
            />
        )
    }
}
