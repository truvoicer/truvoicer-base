import ComparisonDisplay from "@/views/Components/Blocks/Listings/Templates/Comparisons/Layout/ComparisonDisplay";
import HorizontalComparisons from "@/views/Components/Blocks/Listings/Templates/Comparisons/Layout/HorizontalComparisons";
import ComparisonsInfoModal from "@/views/Components/Blocks/Listings/Templates/Comparisons/List/ComparisonsInfoModal";
import ComparisonsItemList from "@/views/Components/Blocks/Listings/Templates/Comparisons/List/ComparisonsItemList";
import ComparisonsItemView from "@/views/Components/Blocks/Listings/Templates/Comparisons/List/ComparisonsItemView";

export default {
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
};
