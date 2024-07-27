import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import CamsSidebarPostItem from "@/views/Components/Blocks/Listings/Templates/Cams/Post/SidebarPostItem";
import CamsSidebarDisplay from "@/views/Components/Blocks/Listings/Templates/Cams/Layout/SidebarDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: CamsSidebarPostItem,
                [LISTINGS_GRID_COMPACT]: CamsSidebarPostItem,
                [LISTINGS_GRID_DETAILED]: CamsSidebarPostItem,
            },
            layout: CamsSidebarDisplay,
        }
    }
};
