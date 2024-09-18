import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import CamsSidebarItemList from "@/views/Components/Blocks/Listings/Templates/Cams/List/SidebarItemList";
import CamsSidebarDisplay from "@/views/Components/Blocks/Listings/Templates/Cams/Layout/SidebarDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: CamsSidebarItemList,
                [LISTINGS_GRID_COMPACT]: CamsSidebarItemList,
                [LISTINGS_GRID_DETAILED]: CamsSidebarItemList,
            },
            layout: CamsSidebarDisplay,
            savedItems: null,
        }
    }
};
