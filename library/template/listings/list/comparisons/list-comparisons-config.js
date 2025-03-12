import ComparisonDisplay from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/Layout/ComparisonDisplay";
import HorizontalComparisons from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/Layout/HorizontalComparisons";
import ComparisonsInfoModal from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/ComparisonsInfoModal";
import ComparisonsItemView from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Comparisons/ComparisonsItemView";

export default {
    templates: {
        default: {
            layout: ComparisonDisplay,
            modal: ComparisonsInfoModal,
            single: ComparisonsItemView
        },
        'vertical_desc_slide': {
            layout: ComparisonDisplay,
            modal: ComparisonsInfoModal,
            single: ComparisonsItemView
        },
        'horizontal_compare': {
            layout: HorizontalComparisons,
            modal: ComparisonsInfoModal,
            single: ComparisonsItemView
        },
    }
};
