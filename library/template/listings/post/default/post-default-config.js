import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import PostItemList from "@/views/Components/Blocks/Listings/Templates/Default/Post/PostItemList";
import PostInfoModal from "@/views/Components/Blocks/Listings/Templates/Default/Post/PostInfoModal";
import ListDisplay from "@/views/Components/Blocks/Listings/Templates/Default/Layout/ListDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: PostItemList,
                [LISTINGS_GRID_COMPACT]: PostItemList,
                [LISTINGS_GRID_DETAILED]: PostItemList,
            },
            modal: PostInfoModal,
            layout: ListDisplay,
            savedItems: null,
        }
    }
};
