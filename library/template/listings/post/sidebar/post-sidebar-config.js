import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import SidebarPostItem from "@/views/Components/Blocks/Listings/Templates/Sidebar/Post/SidebarPostItem";
import PostInfoModal from "@/views/Components/Blocks/Listings/Templates/Sidebar/Post/PostInfoModal";
import SidebarDisplay from "@/views/Components/Blocks/Listings/Templates/Sidebar/Layout/SidebarDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: SidebarPostItem,
                [LISTINGS_GRID_COMPACT]: SidebarPostItem,
                [LISTINGS_GRID_DETAILED]: SidebarPostItem,
            },
            modal: PostInfoModal,
            layout: SidebarDisplay,
            savedItems: null,
        }
    }
};
