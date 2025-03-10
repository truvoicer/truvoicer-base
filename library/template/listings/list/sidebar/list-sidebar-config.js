import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import SidebarItemList from "@/views/Components/Blocks/Listings/Templates/Sidebar/List/SidebarItemList";
import InfoModal from "@/views/Components/Blocks/Listings/Templates/Sidebar/List/InfoModal";
import SidebarDisplay from "@/views/Components/Blocks/Listings/Templates/Sidebar/Layout/SidebarDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: SidebarItemList,
                [LISTINGS_GRID_COMPACT]: SidebarItemList,
                [LISTINGS_GRID_DETAILED]: SidebarItemList,
            },
            modal: InfoModal,
            layout: SidebarDisplay,
            savedItems: null,
        }
    }
};
