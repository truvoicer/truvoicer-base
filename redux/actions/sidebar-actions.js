import {isSet} from "../../library/utils";
import BlogSearch from "../../components/widgets/BlogSearch";
import SidebarMenu from "@/truvoicer-base/components/Menus/SidebarMenu";
import React from "react";
import CategoryListWidget from "../../components/widgets/CategoryListWidget";
import RecentPostsWidget from "../../components/widgets/RecentPostsWidget";
import EmailOptinWidget from "../../components/widgets/EmailOptinWidget";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";

export const buildSidebar = ({sidebarData, templateManager = null}) => {
    let sideBarListData = [];
    if (Array.isArray(sidebarData) && sidebarData.length > 0) {
        sidebarData.map((item, index) => {
            const widgetComponent = getSidebarWidgetComponent({
                item: item

            })
            if (widgetComponent) {
                if (typeof templateManager?.render === 'function') {
                    sideBarListData.push(templateManager.render(widgetComponent))
                } else {
                    sideBarListData.push(widgetComponent)
                }
            }
        })
    }
    return sideBarListData;
}

const getSidebarWidgetComponent = ({item}) => {
    if (item?.search) {
        return <BlogSearch data={item.search}/>
    }
    if (isSet(item.nav_menu)) {
        return <SidebarMenu data={item.nav_menu}/>
    }
    if (isSet(item.categories)) {
        return <CategoryListWidget data={item.categories}/>
    }
    if (isSet(item["recent-posts"])) {
        return <RecentPostsWidget data={item["recent-posts"]}/>
    }
    if (isSet(item.email_optin_widget)) {
        return <EmailOptinWidget data={item.email_optin_widget}/>
    }

    return false;
}
