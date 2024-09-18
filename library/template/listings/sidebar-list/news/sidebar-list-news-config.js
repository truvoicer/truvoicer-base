import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import NewsSidebarItemList from "@/views/Components/Blocks/Listings/Templates/News/List/SidebarItemList";
import NewsSidebarDisplay from "@/views/Components/Blocks/Listings/Templates/News/Layout/SidebarDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: NewsSidebarItemList,
                [LISTINGS_GRID_COMPACT]: NewsSidebarItemList,
                [LISTINGS_GRID_DETAILED]: NewsSidebarItemList,
            },
            layout: NewsSidebarDisplay,
            savedItems: null,
        }
    }
};
