import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import NewsPostItemListPost from "@/views/Components/Blocks/Listings/Templates/News/Post/PostItemListPost";
import NewsPostInfoModal from "@/views/Components/Blocks/Listings/Templates/News/Post/PostInfoModal";
import NewsListDisplay from "@/views/Components/Blocks/Listings/Templates/News/Layout/ListDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: NewsPostItemListPost,
                [LISTINGS_GRID_COMPACT]: NewsPostItemListPost,
                [LISTINGS_GRID_DETAILED]: NewsPostItemListPost,
            },
            modal: NewsPostInfoModal,
            layout: NewsListDisplay,
        }
    }
}
