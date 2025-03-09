import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import ItemList from "@/views/Components/Blocks/Listings/Templates/Default/List/ItemList";
import InfoModal from "@/views/Components/Blocks/Listings/Templates/Default/List/InfoModal";
import ListDisplay from "@/views/Components/Blocks/Listings/Templates/Default/Layout/ListDisplay";

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
