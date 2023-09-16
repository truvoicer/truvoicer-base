import {isSet} from "../../library/utils";
import BlogSearch from "../../components/widgets/BlogSearch";
import ListingsFilter from "../../../views/Components/Blocks/Listings/ListingsFilter/ListingsFilter";
import SidebarMenu from "@/truvoicer-base/components/Menus/SidebarMenu";
import React from "react";
import CategoryListWidget from "../../components/widgets/CategoryListWidget";
import RecentPostsWidget from "../../components/widgets/RecentPostsWidget";
import EmailOptinWidget from "../../components/widgets/EmailOptinWidget";

export const buildSidebar = ({sidebarData, listingsData = false}) => {
    let sideBarListData = [];
    if (Array.isArray(sidebarData) && sidebarData.length > 0) {
        sidebarData.map((item, index) => {
            const widgetComponent = getSidebarWidgetComponent({
                item: item,
                listingsData: listingsData
            })
            if (widgetComponent) {
                sideBarListData.push(widgetComponent)
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

const getSidebarWidgetComponent = ({item, listingsData = false}) => {
    if (item?.search) {
        return (
            <>
                <BlogSearch data={item.search}/>
                {listingsData && <ListingsFilter/>}
            </>
        )
    }
    if (isSet(item.nav_menu)) {
        return (<SidebarMenu data={item.nav_menu}/>)
    }
    if (isSet(item.categories)) {
        return (<CategoryListWidget data={item.categories}/>)
    }
    if (isSet(item["recent-posts"])) {
        return (<RecentPostsWidget data={item["recent-posts"]}/>)
    }
    if (isSet(item.email_optin_widget)) {
        return (<EmailOptinWidget data={item.email_optin_widget}/>)
    }

    return false;
}
