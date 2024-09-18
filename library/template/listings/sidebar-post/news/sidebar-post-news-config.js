import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import NewsSidebarPostItem from "@/views/Components/Blocks/Listings/Templates/News/Post/SidebarPostItem";
import NewsSidebarDisplay from "@/views/Components/Blocks/Listings/Templates/News/Layout/SidebarDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: NewsSidebarPostItem,
                [LISTINGS_GRID_COMPACT]: NewsSidebarPostItem,
                [LISTINGS_GRID_DETAILED]: NewsSidebarPostItem,
            },
            layout: NewsSidebarDisplay,
            savedItems: null,
        }
    }
};
