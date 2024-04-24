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
    DISPLAY_AS_POST_LIST, DISPLAY_AS_SIDEBAR_LIST, DISPLAY_AS_SIDEBAR_POST
} from "@/truvoicer-base/redux/constants/general_constants";
import PostItemListPost from "@/truvoicer-base/components/blocks/listings/items/Post/PostItemListPost";
import DefaultItemList from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultItemList";
import PostInfoModal from "@/truvoicer-base/components/blocks/listings/items/Post/PostInfoModal";
import DefaultInfoModal from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultInfoModal";
import ComparisonsItemList from "@/truvoicer-base/components/blocks/listings/items/Comparisons/ComparisonsItemList";
import DefaultSidebarItemList from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultSidebarItemList";
import DefaultSidebarPostItem from "@/truvoicer-base/components/blocks/listings/items/Post/DefaultSidebarPostItem";

export const defaultListingsGrid = LISTINGS_GRID_LIST;

export const listingsGridConfig = {
    gridItems: {
        [DISPLAY_AS_POST_LIST]: {
            templates: {
                default: {
                    grid: {
                        [LISTINGS_GRID_LIST]: PostItemListPost,
                        [LISTINGS_GRID_COMPACT]: PostItemListPost,
                        [LISTINGS_GRID_DETAILED]: PostItemListPost,
                    },
                    modal: PostInfoModal,
                }
            }
        },
        [DISPLAY_AS_LIST]: {
            templates: {
                default: {
                    grid: {
                        [LISTINGS_GRID_LIST]: DefaultItemList,
                        [LISTINGS_GRID_COMPACT]: DefaultItemList,
                        [LISTINGS_GRID_DETAILED]: DefaultItemList,
                    },
                    modal: DefaultInfoModal,
                }
            }
        },
        [DISPLAY_AS_SIDEBAR_LIST]: {
            templates: {
                default: {
                    grid: {
                        [LISTINGS_GRID_LIST]: DefaultSidebarItemList,
                        [LISTINGS_GRID_COMPACT]: DefaultSidebarItemList,
                        [LISTINGS_GRID_DETAILED]: DefaultSidebarItemList,
                    },
                }
            }
        },
        [DISPLAY_AS_SIDEBAR_POST]: {
            templates: {
                default: {
                    grid: {
                        [LISTINGS_GRID_LIST]: DefaultSidebarPostItem,
                        [LISTINGS_GRID_COMPACT]: DefaultSidebarPostItem,
                        [LISTINGS_GRID_DETAILED]: DefaultSidebarPostItem,
                    },
                }
            }
        },
        [DISPLAY_AS_COMPARISONS]: {
            templates: {
                default: {
                    grid: {
                        [LISTINGS_GRID_LIST]: ComparisonsItemList,
                    },
                    modal: ComparisonsInfoModal,
                    single: ComparisonsItemView
                }
            }
        },
    },
}
