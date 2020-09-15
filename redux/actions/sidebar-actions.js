import store from "../store"
import {
    FOOTER_REQUEST,
    LEFT_SIDEBAR_REQUEST, NAVBAR_REQUEST,
    RIGHT_SIDEBAR_REQUEST,
} from "../constants/sidebar-constants";
import {
    setFooterData,
    setPageError,
    setLeftSidebarData,
    setRightSidebarData, setNavBarData
} from "../reducers/page-reducer";

export function setSidebarAction(data, sidebarRequest) {
    switch (sidebarRequest) {
        case LEFT_SIDEBAR_REQUEST:
            store.dispatch(setLeftSidebarData(data))
            break;
        case RIGHT_SIDEBAR_REQUEST:
            store.dispatch(setRightSidebarData(data))
            break;
        case NAVBAR_REQUEST:
            store.dispatch(setNavBarData(data));
            break;
        case FOOTER_REQUEST:
            store.dispatch(setFooterData(data));
            break;
        default:
            store.dispatch(setPageError("Sidebar request invalid..."));
            break;
    }
}