import {
    LISTINGS_GRID_COMPACT, LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import ComparisonsInfoModal
    from "../../views/Components/Blocks/Listings/ListingsItems/Items/Comparisons/ComparisonsInfoModal";
import ComparisonsItemView
    from "../../views/Components/Blocks/Listings/ListingsItems/Items/Comparisons/ComparisonsItemView";
import {
    DISPLAY_AS_COMPARISONS,
    DISPLAY_AS_LIST,
    DISPLAY_AS_POST_LIST
} from "@/truvoicer-base/redux/constants/general_constants";
import NewsItemListPost from "@/truvoicer-base/components/blocks/listings/items/News/NewsItemListPost";
import DefaultItemList from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultItemList";
import NewsInfoModal from "@/truvoicer-base/components/blocks/listings/items/News/NewsInfoModal";
import NewsItemView from "@/truvoicer-base/components/blocks/listings/items/News/NewsItemView";
import DefaultInfoModal from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultInfoModal";
import DefaultItemView from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultItemView";
import ComparisonsItemList from "@/truvoicer-base/components/blocks/listings/items/Comparisons/ComparisonsItemList";
import NewsItemList from "@/truvoicer-base/components/blocks/listings/items/News/NewsItemList";

export const defaultListingsGrid = LISTINGS_GRID_LIST;

export const listingsGridConfig =  {
    gridItems: {
        [DISPLAY_AS_POST_LIST]: {
            [LISTINGS_GRID_LIST]: NewsItemListPost,
            [LISTINGS_GRID_COMPACT]: NewsItemListPost,
            [LISTINGS_GRID_DETAILED]: NewsItemListPost,
            modal: NewsInfoModal,
            single: NewsItemView,
            singlePost: NewsItemListPost,
        },
        [DISPLAY_AS_LIST]: {
            [LISTINGS_GRID_LIST]: DefaultItemList,
            [LISTINGS_GRID_COMPACT]: DefaultItemList,
            [LISTINGS_GRID_DETAILED]: DefaultItemList,
            modal: DefaultInfoModal,
            single: DefaultItemView,
            singlePost: NewsItemListPost,
        },
        [DISPLAY_AS_COMPARISONS]: {
            [LISTINGS_GRID_LIST]: ComparisonsItemList,
            modal: ComparisonsInfoModal,
            single: ComparisonsItemView
        },
        job_news: {
            [LISTINGS_GRID_LIST]: NewsItemList,
            modal: NewsInfoModal,
            single: NewsItemView
        },
    },
}
