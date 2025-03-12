import {
    LISTINGS_GRID_COMPACT, LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import {
    DISPLAY_AS_LIST,
    DISPLAY_AS_POST,
} from "@/truvoicer-base/redux/constants/general_constants";

import ListItemList from "../components/blocks/listings/items/DisplayAs/List/Templates/Default/ListItemList";
import ListInfoModal from "../components/blocks/listings/items/DisplayAs/List/Templates/Default/ListInfoModal";
import ListDisplay from "../components/blocks/listings/items/DisplayAs/List/Templates/Default/Layout/ListDisplay";
import ListSidebarItemList from "../components/blocks/listings/items/DisplayAs/List/Templates/Sidebar/ListSidebarItemList";
import ListSidebarDisplay from "../components/blocks/listings/items/DisplayAs/List/Templates/Sidebar/Layout/SidebarDisplay";
import ListTileDisplay from "../components/blocks/listings/items/DisplayAs/List/Templates/Tiles/Layout/TileDisplay";
import ListComparisonDisplay from "../components/blocks/listings/items/DisplayAs/List/Templates/Comparisons/Layout/ComparisonDisplay";
import ListComparisonsInfoModal from "../components/blocks/listings/items/DisplayAs/List/Templates/Comparisons/ComparisonsInfoModal";
import ListComparisonsItemView from "../components/blocks/listings/items/DisplayAs/List/Templates/Comparisons/ComparisonsItemView";
import ListHorizontalComparisons from "../components/blocks/listings/items/DisplayAs/List/Templates/Comparisons/Layout/HorizontalComparisons";
import PostItemList from "../components/blocks/listings/items/DisplayAs/Post/Templates/Default/PostItemList";
import PostInfoModal from "../components/blocks/listings/items/DisplayAs/Post/Templates/Default/PostInfoModal";
import PostListDisplay from "../components/blocks/listings/items/DisplayAs/Post/Templates/Default/Layout/ListDisplay";
import PostSidebarDisplay from "../components/blocks/listings/items/DisplayAs/Post/Templates/Sidebar/Layout/SidebarDisplay";

import DefaultSidebarPostItem from "../components/blocks/listings/items/DisplayAs/Post/Templates/Sidebar/DefaultSidebarPostItem";
import PostTileDisplay from "../components/blocks/listings/items/DisplayAs/Post/Templates/Tiles/Layout/TileDisplay";
import PostComparisonsItemList from "../components/blocks/listings/items/DisplayAs/Post/Templates/Comparisons/ComparisonsItemList";

import PostComparisonDisplay from "../components/blocks/listings/items/DisplayAs/Post/Templates/Comparisons/Layout/ComparisonDisplay";
import PostComparisonsInfoModal from "../components/blocks/listings/items/DisplayAs/Post/Templates/Comparisons/ComparisonsInfoModal";
import PostComparisonsItemView from "../components/blocks/listings/items/DisplayAs/Post/Templates/Comparisons/ComparisonsItemView";
import PostHorizontalComparisons from "../components/blocks/listings/items/DisplayAs/Post/Templates/Comparisons/Layout/HorizontalComparisons";

export const defaultListingsGrid = LISTINGS_GRID_LIST;

export const listingsGridConfig = {
        [DISPLAY_AS_LIST]: {
            default: {
                templates: {
                    default: {
                        gridItems: {
                            [LISTINGS_GRID_LIST]: ListItemList,
                            [LISTINGS_GRID_COMPACT]: ListItemList,
                            [LISTINGS_GRID_DETAILED]: ListItemList,
                        },
                        modal: ListInfoModal,
                        layout: ListDisplay,
                        savedItems: null,
                    }
                }
            },
            sidebar: {
                templates: {
                    default: {
                        gridItems: {
                            [LISTINGS_GRID_LIST]: ListSidebarItemList,
                            [LISTINGS_GRID_COMPACT]: ListSidebarItemList,
                            [LISTINGS_GRID_DETAILED]: ListSidebarItemList,
                        },
                        modal: ListInfoModal,
                        layout: ListSidebarDisplay,
                        savedItems: null,
                    }
                }
            },
            tiles: {
                templates: {
                    default: {
                        modal: ListInfoModal,
                        layout: ListTileDisplay,
                        savedItems: null,
                    }
                }
            },
            comparisons: {
                templates: {
                    default: {
                        layout: ListComparisonDisplay,
                        modal: ListComparisonsInfoModal,
                        single: ListComparisonsItemView
                    },
                    'vertical_desc_slide': {
                        layout: ListComparisonDisplay,
                        modal: ListComparisonsInfoModal,
                        single: ListComparisonsItemView
                    },
                    'horizontal_compare': {
                        layout: ListHorizontalComparisons,
                        modal: ListComparisonsInfoModal,
                        single: ListComparisonsItemView
                    },
                }
            },
        },
        [DISPLAY_AS_POST]: {
            default: {
                templates: {
                    default: {
                        gridItems: {
                            [LISTINGS_GRID_LIST]: PostItemList,
                            [LISTINGS_GRID_COMPACT]: PostItemList,
                            [LISTINGS_GRID_DETAILED]: PostItemList,
                        },
                        modal: PostInfoModal,
                        layout: PostListDisplay,
                        savedItems: null,
                    }
                }
            },
            sidebar: {
                templates: {
                    default: {
                        gridItems: {
                            [LISTINGS_GRID_LIST]: DefaultSidebarPostItem,
                            [LISTINGS_GRID_COMPACT]: DefaultSidebarPostItem,
                            [LISTINGS_GRID_DETAILED]: DefaultSidebarPostItem,
                        },
                        modal: PostInfoModal,
                        layout: PostSidebarDisplay,
                        savedItems: null,
                    }
                }
            },
            tiles: {
                templates: {
                    default: {
                        modal: PostInfoModal,
                        layout: PostTileDisplay,
                        savedItems: null,
                    }
                }
            },
            comparisons: {
                templates: {
                    default: {
                        gridItems: {
                            [LISTINGS_GRID_LIST]: PostComparisonsItemList,
                        },
                        layout: PostComparisonDisplay,
                        modal: PostComparisonsInfoModal,
                        single: PostComparisonsItemView
                    },
                    'vertical_desc_slide': {
                        gridItems: {
                            [LISTINGS_GRID_LIST]: PostComparisonsItemList,
                        },
                        layout: PostComparisonDisplay,
                        modal: PostComparisonsInfoModal,
                        single: PostComparisonsItemView
                    },
                    'horizontal_compare': {
                        gridItems: {
                            [LISTINGS_GRID_LIST]: PostComparisonsItemList,
                        },
                        layout: PostHorizontalComparisons,
                        modal: PostComparisonsInfoModal,
                        single: PostComparisonsItemView
                    },
                }
            },
        },
    }
