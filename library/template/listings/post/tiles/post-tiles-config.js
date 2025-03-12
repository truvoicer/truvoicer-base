import PostInfoModal from "@/views/Components/Blocks/Listings/DisplayAs/Post/Templates/Sidebar/PostInfoModal";
import TileDisplay from "@/views/Components/Blocks/Listings/DisplayAs/Post/Templates/Tiles/Layout/TileDisplay";

export default {
    templates: {
        default: {
            modal: PostInfoModal,
            layout: TileDisplay,
            savedItems: null,
        }
    }
};
