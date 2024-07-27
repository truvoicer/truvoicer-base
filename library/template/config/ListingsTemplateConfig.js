import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";

export class ListingsTemplateConfig {

    config = {}

    getConfig() {
        return this.config;
    }

    addGridConfig({
        displayAs,
        service,
        template,
        templateConfig
    }) {
        this.config[displayAs][service].templates[template] = templateConfig;
    }

    addGridItems({
        gridList = null,
        gridCompact = null,
        gridDetailed = null,
        modal = null,
        layout = null,
    }) {
        return {
            gridItems: {
                [LISTINGS_GRID_LIST]: gridList,
                [LISTINGS_GRID_COMPACT]: gridCompact,
                [LISTINGS_GRID_DETAILED]: gridDetailed,
            },
            modal,
            layout,
        }
    }
}
