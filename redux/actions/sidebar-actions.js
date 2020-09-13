import store from "../store"
import {FOOTER_REQUEST, SIDEBAR_REQUEST, TOPBAR_REQUEST} from "../constants/sidebar-constants";
import {setFooterData, setPageError, setSidebarData, setTopBarData} from "../reducers/page-reducer";

export function setSidebarAction(data, sidebarRequest) {
    switch (sidebarRequest) {
        case SIDEBAR_REQUEST:
            store.dispatch(setSidebarData(data))
            break;
        case TOPBAR_REQUEST:
            store.dispatch(setTopBarData(data));
            break;
        case FOOTER_REQUEST:
            store.dispatch(setFooterData(data));
            break;
        default:
            store.dispatch(setPageError("Sidebar request invalid..."));
            break;
    }
}