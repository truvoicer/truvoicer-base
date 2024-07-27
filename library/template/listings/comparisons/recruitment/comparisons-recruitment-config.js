import {LISTINGS_GRID_LIST} from "@/truvoicer-base/redux/constants/listings-constants";
import ComparisonsItemList
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Comparisons/ComparisonsItemList";
import ComparisonDisplay
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/comparisons/ComparisonDisplay";
import ComparisonsInfoModal
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Comparisons/ComparisonsInfoModal";
import ComparisonsItemView
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Comparisons/ComparisonsItemView";
import HorizontalComparisons
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/comparisons/HorizontalComparisons";

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
