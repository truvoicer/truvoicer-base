import { LISTINGS_GRID_LIST } from "@/truvoicer-base/redux/constants/listings-constants";
import ComparisonDisplay from "@/views/Components/Blocks/Listings/Templates/Comparisons/Layout/ComparisonDisplay";
import HorizontalComparisons from "@/views/Components/Blocks/Listings/Templates/Comparisons/Layout/HorizontalComparisons";
import ComparisonsPostInfoModal from "@/views/Components/Blocks/Listings/Templates/Comparisons/Post/ComparisonsPostInfoModal";
import ComparisonsPostItem from "@/views/Components/Blocks/Listings/Templates/Comparisons/Post/ComparisonsPostItem";
import ComparisonsPostItemView from "@/views/Components/Blocks/Listings/Templates/Comparisons/Post/ComparisonsPostItemView";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: ComparisonsPostItem,
            },
            layout: ComparisonDisplay,
            modal: ComparisonsPostInfoModal,
            single: ComparisonsPostItemView
        },
        'vertical_desc_slide': {
            gridItems: {
                [LISTINGS_GRID_LIST]: ComparisonsPostItem,
            },
            layout: ComparisonDisplay,
            modal: ComparisonsPostInfoModal,
            single: ComparisonsPostItemView
        },
        'horizontal_compare': {
            gridItems: {
                [LISTINGS_GRID_LIST]: ComparisonsPostItem,
            },
            layout: HorizontalComparisons,
            modal: ComparisonsPostInfoModal,
            single: ComparisonsPostItemView
        },
    }
};
