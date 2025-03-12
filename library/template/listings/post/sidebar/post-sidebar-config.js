import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import SidebarPostItem from "@/views/Components/Blocks/Listings/DisplayAs/Post/Templates/Sidebar/SidebarPostItem";
import PostInfoModal from "@/views/Components/Blocks/Listings/DisplayAs/Post/Templates/Sidebar/PostInfoModal";
import SidebarDisplay from "@/views/Components/Blocks/Listings/DisplayAs/Post/Templates/Sidebar/Layout/SidebarDisplay";

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
