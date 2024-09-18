import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import ItemList from "@/views/Components/Blocks/Listings/Templates/Recruitment/List/ItemList";
import InfoModal from "@/views/Components/Blocks/Listings/Templates/Recruitment/List/InfoModal";
import ListDisplay from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/ListDisplay";
import ItemView from "@/views/Components/Blocks/Listings/Templates/Recruitment/List/ItemView";
import SavedItemsDisplay from "@/views/Components/Blocks/Listings/Templates/Mixed/SavedItemsDisplay";

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
            itemView: ItemView,
            savedItems: SavedItemsDisplay,
        }
    }
};
