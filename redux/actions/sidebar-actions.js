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
import {isObjectEmpty} from "../../library/utils";
import {siteConfig} from "../../../config/site-config";

export function setBaseSidebarsJson(sidebarsJson) {
    console.log("Parsing sidebars...")
    const sidebars = JSON.parse(sidebarsJson.sidebars_json);
    console.log("Parsed sidebars")
    console.log(sidebars)
    if (isObjectEmpty(sidebars)) {
        return false;
    }
    Object.keys(sidebars).map((sidebarKey) => {
        switch (sidebarKey) {
            case siteConfig.navBarName:
                setBaseSidebarAction(sidebars[sidebarKey], NAVBAR_REQUEST);
                break;
            case siteConfig.leftSidebarName:
                setBaseSidebarAction(sidebars[sidebarKey], LEFT_SIDEBAR_REQUEST);
                break;
            case siteConfig.rightSidebarName:
                setBaseSidebarAction(sidebars[sidebarKey], RIGHT_SIDEBAR_REQUEST);
                break;
            case siteConfig.footerName:
                setBaseSidebarAction(sidebars[sidebarKey], FOOTER_REQUEST);
                break;
            default:
                break;
        }
    })
}

export function setBaseSidebarAction(data, sidebarRequest) {
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