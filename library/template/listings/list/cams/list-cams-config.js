import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import CamsItemList from "@/views/Components/Blocks/Listings/Templates/Cams/List/ItemList";
import CamsInfoModal from "@/views/Components/Blocks/Listings/Templates/Cams/List/InfoModal";
import CamsListDisplay from "@/views/Components/Blocks/Listings/Templates/Cams/Layout/ListDisplay";

export default {
    templates: {
        default: {
            gridItems: {
                [LISTINGS_GRID_LIST]: CamsItemList,
                [LISTINGS_GRID_COMPACT]: CamsItemList,
                [LISTINGS_GRID_DETAILED]: CamsItemList,
            },
            modal: CamsInfoModal,
            layout: CamsListDisplay,
        }
    }
};
