import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import NewsItemList from "@/views/Components/Blocks/Listings/Templates/News/List/ItemList";
import NewsInfoModal from "@/views/Components/Blocks/Listings/Templates/News/List/InfoModal";
import NewsListDisplay from "@/views/Components/Blocks/Listings/Templates/News/Layout/ListDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: NewsItemList,
                [LISTINGS_GRID_COMPACT]: NewsItemList,
                [LISTINGS_GRID_DETAILED]: NewsItemList,
            },
            modal: NewsInfoModal,
            layout: NewsListDisplay,
        }
    }
};
