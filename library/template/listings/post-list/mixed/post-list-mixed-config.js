import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import PostItemListPost from "@/views/Components/Blocks/Listings/Templates/Recruitment/Post/PostItemListPost";
import PostInfoModal from "@/views/Components/Blocks/Listings/Templates/Recruitment/Post/PostInfoModal";
import ListDisplay from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/ListDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: PostItemListPost,
                [LISTINGS_GRID_COMPACT]: PostItemListPost,
                [LISTINGS_GRID_DETAILED]: PostItemListPost,
            },
            modal: PostInfoModal,
            layout: ListDisplay,
            savedItems: null,
        }
    }
}
