import { LISTINGS_GRID_LIST } from "@/truvoicer-base/redux/constants/listings-constants";
import ComparisonDisplay from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/Layout/ComparisonDisplay";
import HorizontalComparisons from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/Layout/HorizontalComparisons";
import ComparisonsInfoModal from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/ComparisonsInfoModal";
import ComparisonsItemList from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/ComparisonsItemList";
import ComparisonsItemView from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/ComparisonsItemView";

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
