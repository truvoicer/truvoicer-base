import {convertImageObjectsToArray, findInObject, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {listingsGridConfig} from "@/truvoicer-base/config/listings-grid-config";
import React from "react";
import {mapDataToKeymap} from "@/truvoicer-base/library/helpers/wp-helpers";
import {templateConfig} from "@/config/template-config";

export class ListingsGrid {
    keyMap = null;

    setKeyMap(keyMap) {
        this.keyMap = keyMap;
    }
    validateGridConfigStyle({displayAs, template = 'default', style = 'default'}) {
        const gridConfig = templateConfig();
        if (!isSet(gridConfig?.listings)) {
            console.warn("No grid config for displayAs", displayAs);
            return false;
        }
        if (!isSet(gridConfig.listings?.grid)) {
            console.warn("No grid config for displayAs", displayAs);
            return false;
        }
        if (!isSet(gridConfig.listings.grid?.[displayAs])) {
            console.warn("No grid config for displayAs", displayAs);
            return false;
        }
        if (!isSet(gridConfig.listings.grid[displayAs]?.[template])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | template ${template} not set`);
            return false;
        }
        if (!isSet(gridConfig.listings.grid[displayAs][template]?.templates)) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | templates object not set`);
            return false;
        }
        if (!isSet(gridConfig.listings.grid[displayAs][template].templates?.[style])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | style ${style} not set`);
            return false;
        }
        return true;
    }
    buildTemplateComponentConfigIdentifier({displayAs, template = 'default', style = 'default', component}) {
        const gridConfig = templateConfig();
        if (!this.validateGridConfigStyle({displayAs, template, style})) {
            return false;
        }
        if (!isSet(gridConfig.listings.grid[displayAs][template].templates[style]?.[component])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | component ${component} not set`);
            return false;
        }
        return gridConfig.listings.grid[displayAs][template].templates[style][component];
    }
    buildTemplateConfigIdentifier({displayAs, listingsGrid, template = 'default', style = 'default'}) {
        const gridConfig = templateConfig();
        if (!this.validateGridConfigStyle({displayAs, template, style})) {
            return false;
        }
        if (!isSet(gridConfig.listings.grid[displayAs][template].templates[style]?.gridItems)) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | gridItems object not set`);
            return false;
        }
        if (!isSet(gridConfig.listings.grid[displayAs][template].templates[style].gridItems?.[listingsGrid])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | gridItems ${listingsGrid} not set`);
            return false;
        }
        return gridConfig.listings.grid[displayAs][template].templates[style].gridItems[listingsGrid];
    }
    findTemplateGridItemComponent({displayAs, listingsGrid, template = 'default', style = 'default'}) {
        return this.buildTemplateConfigIdentifier({
            displayAs,
            listingsGrid,
            template,
            style
        });
    }
    findTemplateListingComponent({displayAs, component, template = 'default', style = 'default'}) {
        return this.buildTemplateComponentConfigIdentifier({
            displayAs,
            template,
            component,
            style
        });
    }
    findGridTemplateConfig({displayAs, template = 'default', style = 'default'}) {
        if (!isSet(listingsGridConfig[displayAs])) {
            console.warn("No grid config for displayAs", displayAs);
            return false;
        }
        if (!isSet(listingsGridConfig[displayAs]?.[template])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | template ${template} not set`);
            return false;
        }
        if (!isSet(listingsGridConfig[displayAs][template]?.templates)) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | templates object not set`);
            return false;
        }
        if (!isSet(listingsGridConfig[displayAs][template].templates?.[style])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | style ${style} not set`);
            return false;
        }
        return listingsGridConfig[displayAs][template].templates[style];
    }
    findDefaultGridItemComponent({displayAs, template = 'default', style = 'default', listingsGrid}) {
        const templateConfig = this.findGridTemplateConfig({displayAs, template, style});
        if (!templateConfig) {
            return null;
        }
        if (!isSet(listingsGridConfig[displayAs]?.templates[template].gridItems)) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | template ${template} | gridItems object not set`);
            return null;
        }

        if (!isSet(listingsGridConfig[displayAs]?.templates[template].gridItems?.[listingsGrid])) {
            console.warn(`Invalid grid config for (displayAs ${displayAs}) | template ${template} | gridItems ${listingsGrid} not set`);
            return null;
        }
        return listingsGridConfig[displayAs]?.templates[template].gridItems[listingsGrid];
    }

    getGridItem({item, displayAs, category, listingsGrid, template, style, index}) {
        let gridItem = {...item};
        if (isSet(gridItem.image_list)) {
            gridItem.image_list = convertImageObjectsToArray(gridItem.image_list);
        }
        const buildData = mapDataToKeymap({item, gridItem, keymap: this.keyMap});

        let GridItemComponent = this.findTemplateGridItemComponent({
            displayAs,
            category,
            listingsGrid,
            template,
            style
        });
        if (!GridItemComponent) {
            GridItemComponent = this.findDefaultGridItemComponent({
                displayAs,
                category,
                listingsGrid,
                template,
                style
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
    getTemplateListingComponent({displayAs, template, style, component, props}) {
        let GridLayoutComponent = this.findTemplateListingComponent({
            displayAs,
            template,
            component,
            style
        });
        if (!GridLayoutComponent) {
            console.warn("No template layout component found for", {displayAs, template, style});
            return null;
        }

        return (
            <GridLayoutComponent
                {...props}
            />
        )
    }
}
