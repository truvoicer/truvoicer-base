import {isSet} from "../../library/utils";
import BlogSearch from "../../../views/Components/Widgets/BlogSearch";
import ListingsFilter from "../../../views/Components/Blocks/Listings/ListingsFilter/ListingsFilter";
import SidebarMenu from "../../../views/Components/Menus/SidebarMenu";
import React from "react";

export const buildSidebar = ({sidebarData, listingsData}) => {
    let sideBarListData = [];
    if (Array.isArray(sidebarData) && sidebarData.length > 0) {
        sidebarData.map((item, index) => {
            if (isSet(item.search)) {
                sideBarListData.push(
                    <>
                        <BlogSearch data={item.search}/>
                        {listingsData && <ListingsFilter/>}
                    </>
                )
                if (isSet(item.nav_menu)) {
                    sideBarListData.push(<SidebarMenu data={item.nav_menu}/>)
                }
            }
        })
    } else {
        sideBarListData.push(
            <>
                {listingsData && <ListingsFilter/>}
            </>
        )
    }
    return sideBarListData;
}