import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import ItemList from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Default/ItemList";
import InfoModal from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Default/InfoModal";
import ListDisplay from "@/views/Components/Blocks/Listings/DisplayAs/List/Templates/Default/Layout/ListDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: ItemList,
                [LISTINGS_GRID_COMPACT]: ItemList,
                [LISTINGS_GRID_DETAILED]: ItemList,
            },
            modal: InfoModal,
            layout: ListDisplay,
            savedItems: null,
        }
    }
};
