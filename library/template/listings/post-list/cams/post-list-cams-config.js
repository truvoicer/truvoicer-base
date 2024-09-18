import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import CamsPostItemListPost from "@/views/Components/Blocks/Listings/Templates/Cams/Post/PostItemListPost";
import CamsPostInfoModal from "@/views/Components/Blocks/Listings/Templates/Cams/Post/PostInfoModal";
import CamsListDisplay from "@/views/Components/Blocks/Listings/Templates/Cams/Layout/ListDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: CamsPostItemListPost,
                [LISTINGS_GRID_COMPACT]: CamsPostItemListPost,
                [LISTINGS_GRID_DETAILED]: CamsPostItemListPost,
            },
            modal: CamsPostInfoModal,
            layout: CamsListDisplay,
            savedItems: null,
        }
    }
}
