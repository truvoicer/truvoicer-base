import {
    LISTINGS_GRID_COMPACT, LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import {
    DISPLAY_AS_COMPARISONS,
    DISPLAY_AS_LIST,
    DISPLAY_AS_POST,
    DISPLAY_AS_POST_LIST, DISPLAY_AS_SIDEBAR_LIST, DISPLAY_AS_SIDEBAR_POST, DISPLAY_AS_TILES
} from "@/truvoicer-base/redux/constants/general_constants";
import PostItemListPost from "@/truvoicer-base/components/blocks/listings/items/Post/PostItemListPost";
import DefaultItemList from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultItemList";
import PostInfoModal from "@/truvoicer-base/components/blocks/listings/items/Post/PostInfoModal";
import DefaultInfoModal from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultInfoModal";
import ComparisonsItemList from "@/truvoicer-base/components/blocks/listings/items/Comparisons/ComparisonsItemList";
import DefaultSidebarItemList from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultSidebarItemList";
import DefaultSidebarPostItem from "@/truvoicer-base/components/blocks/listings/items/Post/DefaultSidebarPostItem";
import HorizontalComparisons
    from "@/truvoicer-base/components/blocks/listings/display/comparisons/HorizontalComparisons";
import TileDisplay from "@/truvoicer-base/components/blocks/listings/display/TileDisplay";
import ListDisplay from "@/truvoicer-base/components/blocks/listings/display/ListDisplay";
import SidebarDisplay from "@/truvoicer-base/components/blocks/listings/display/SidebarDisplay";
import ComparisonDisplay from "@/truvoicer-base/components/blocks/listings/display/comparisons/ComparisonDisplay";
import ComparisonsInfoModal from "@/truvoicer-base/components/blocks/listings/items/Comparisons/ComparisonsInfoModal";
import ComparisonsItemView from "@/truvoicer-base/components/blocks/listings/items/Comparisons/ComparisonsItemView";

export const defaultListingsGrid = LISTINGS_GRID_LIST;

export const listingsGridConfig = {
        [DISPLAY_AS_LIST]: {
            default: {

            },
            sidebar: {

            },
            tiles: {

            },
            comparisons: {

            },
        },
        [DISPLAY_AS_POST]: {
            default: {

            },
            sidebar: {

            },
            tiles: {

            },
            comparisons: {
                
            },
        },
        [DISPLAY_AS_POST]: {
            templates: {
                default: {
                    gridItems: {
                        [LISTINGS_GRID_LIST]: PostItemListPost,
                        [LISTINGS_GRID_COMPACT]: PostItemListPost,
                        [LISTINGS_GRID_DETAILED]: PostItemListPost,
                    },
                    modal: PostInfoModal,
                    layout: ListDisplay,
                }
            }
        },
        [DISPLAY_AS_LIST]: {
            templates: {
                default: {
                    gridItems: {
                        [LISTINGS_GRID_LIST]: DefaultItemList,
                        [LISTINGS_GRID_COMPACT]: DefaultItemList,
                        [LISTINGS_GRID_DETAILED]: DefaultItemList,
                    },
                    modal: DefaultInfoModal,
                    layout: ListDisplay,
                }
            }
        },
        [DISPLAY_AS_SIDEBAR_LIST]: {
            templates: {
                default: {
                    gridItems: {
                        [LISTINGS_GRID_LIST]: DefaultSidebarItemList,
                        [LISTINGS_GRID_COMPACT]: DefaultSidebarItemList,
                        [LISTINGS_GRID_DETAILED]: DefaultSidebarItemList,
                    },
                    layout: SidebarDisplay,
                }
            }
        },
        [DISPLAY_AS_SIDEBAR_POST]: {
            templates: {
                default: {
                    gridItems: {
                        [LISTINGS_GRID_LIST]: DefaultSidebarPostItem,
                        [LISTINGS_GRID_COMPACT]: DefaultSidebarPostItem,
                        [LISTINGS_GRID_DETAILED]: DefaultSidebarPostItem,
                    },
                    layout: SidebarDisplay,
                }
            }
        },
        [DISPLAY_AS_COMPARISONS]: {
            templates: {
                default: {
                    gridItems: {
                        [LISTINGS_GRID_LIST]: ComparisonsItemList,
                    },
                    layout: ComparisonDisplay,
                    modal: ComparisonsInfoModal,
                    single: ComparisonsItemView
                },
                'vertical_desc_slide': {
                    gridItems: {
                        [LISTINGS_GRID_LIST]: ComparisonsItemList,
                    },
                    layout: ComparisonDisplay,
                    modal: ComparisonsInfoModal,
                    single: ComparisonsItemView
                },
                'horizontal_compare': {
                    gridItems: {
                        [LISTINGS_GRID_LIST]: ComparisonsItemList,
                    },
                    layout: HorizontalComparisons,
                    modal: ComparisonsInfoModal,
                    single: ComparisonsItemView
                },
            }
        },
        [DISPLAY_AS_TILES]: {
            templates: {
                default: {
                    layout: TileDisplay,
                }
            }
        },
    }
