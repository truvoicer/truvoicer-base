import {convertImageObjectsToArray, isSet} from "@/truvoicer-base/library/utils";
import {listingsGridConfig} from "@/config/listings-grid-config";
import React from "react";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

export class ListingsGrid {
    constructor(listingsContext, searchContext) {
        this.listingsManager = new ListingsManager(listingsContext, searchContext);
    }
    getGridItem(item, category, listingsGrid, userId, showInfoCallback, index = false) {
        let gridItem = {...item};
        if (isSet(gridItem.image_list)) {
            gridItem.image_list = convertImageObjectsToArray(gridItem.image_list);
        }
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[category])) {
            return null;
        }
        if (!isSet(gridConfig[category][listingsGrid])) {
            return null;
        }
        const GridItems = gridConfig[category][listingsGrid];
        return (
            <GridItems
                index={index}
                data={gridItem}
                searchCategory={category}
                showInfoCallback={showInfoCallback}
                savedItem={
                    this.listingsManager.searchEngine.isSavedItemAction(
                        isSet(item?.item_id) ? item.item_id : null,
                        isSet(item?.provider) ? item.provider : null,
                        category,
                        userId
                    )
                }
                ratingsData={
                    this.listingsManager.searchEngine.getItemRatingDataAction(
                        isSet(item?.item_id) ? item.item_id : null,
                        isSet(item?.provider) ? item.provider : null,
                        category,
                        userId
                    )
                }
            />
        )
    }
}
