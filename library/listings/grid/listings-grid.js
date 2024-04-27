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

    buildTemplateConfigIdentifier({displayAs, category, listingsGrid, template = 'default'}) {
        return `listings.grid.${displayAs}.${template}.${listingsGrid}`;
    }
    findTemplateGridItemComponent({displayAs, category, listingsGrid, template = 'default'}) {
        const gridConfig = templateConfig();
        return findInObject(
            this.buildTemplateConfigIdentifier({
                displayAs,
                category,
                listingsGrid,
                template
            }),
            gridConfig
        );
    }
    findDefaultGridItemComponent({displayAs, template = 'default', listingsGrid}) {
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[displayAs])) {
            console.warn("No grid config for displayAs", displayAs);
            return null;
        }
        if (!isSet(gridConfig[displayAs]?.templates)) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | templates object not set`);
            return null;
        }
        if (!isSet(gridConfig[displayAs]?.templates?.[template])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | template ${template} not set`);
            return null;
        }
        if (!isSet(gridConfig[displayAs]?.templates[template].grid)) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | template ${template} | grid object not set`);
            return null;
        }

        if (!isSet(gridConfig[displayAs]?.templates[template].grid?.[listingsGrid])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | template ${template} | grid ${listingsGrid} not set`);
            return null;
        }
        return gridConfig[displayAs]?.templates[template].grid[listingsGrid];
    }

    getGridItem({item, displayAs, category, listingsGrid, template, index}) {
        let gridItem = {...item};
        if (isSet(gridItem.image_list)) {
            gridItem.image_list = convertImageObjectsToArray(gridItem.image_list);
        }
        const buildData = mapDataToKeymap({item, gridItem, keymap: this.keyMap});

        let GridItemComponent = this.findTemplateGridItemComponent({
            displayAs,
            category,
            listingsGrid,
            template
        });
        if (!GridItemComponent) {
            GridItemComponent = this.findDefaultGridItemComponent({
                displayAs,
                category,
                listingsGrid,
                template
            });
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
            />
        )
    }
}
