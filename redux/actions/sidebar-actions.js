import {isSet} from "../../library/utils";
import BlogSearch from "../../components/widgets/BlogSearch";
import ListingsFilter from "../../components/blocks/listings/filters/ListingsFilter";
import SidebarMenu from "@/truvoicer-base/components/Menus/SidebarMenu";
import React, {useContext} from "react";
import CategoryListWidget from "../../components/widgets/CategoryListWidget";
import RecentPostsWidget from "../../components/widgets/RecentPostsWidget";
import EmailOptinWidget from "../../components/widgets/EmailOptinWidget";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";

export const buildSidebar = ({sidebarData, listingsData = false, templateContext = false}) => {
    const templateManager = new TemplateManager(templateContext);
    let sideBarListData = [];
    if (Array.isArray(sidebarData) && sidebarData.length > 0) {
        sidebarData.map((item, index) => {
            const widgetComponent = getSidebarWidgetComponent({
                item: item,
                listingsData: listingsData,
                templateContext
            })
            if (widgetComponent) {
                sideBarListData.push(widgetComponent)
            }
        })
    } else {
        sideBarListData.push(
            <>
                {listingsData &&
                    templateManager.getTemplateComponent({
                        category: 'listings',
                        templateId: 'listingsFilter',
                        defaultComponent: <ListingsFilter />
                    })
                }
            </>
        )
    }
    return sideBarListData;
}

const getSidebarWidgetComponent = ({item, listingsData = false, templateContext = false}) => {
    const templateManager = new TemplateManager(templateContext);
    if (item?.search) {
        return (
            <>
                {
                    templateManager.getTemplateComponent({
                        category: 'listings',
                        templateId: 'blogSearch',
                        defaultComponent: <BlogSearch data={item.search}/>,
                        props: {data: item.search}
                    })
                }
                {listingsData &&
                    templateManager.getTemplateComponent({
                        category: 'listings',
                        templateId: 'listingsFilter',
                        defaultComponent: <ListingsFilter />
                    })
                }
            </>
        )
    }
    if (isSet(item.nav_menu)) {
        return templateManager.getTemplateComponent({
            category: 'listings',
            templateId: 'sidebarMenu',
            defaultComponent: <SidebarMenu data={item.nav_menu}/>,
            props: {data: item.nav_menu}
        })
    }
    if (isSet(item.categories)) {
        return templateManager.getTemplateComponent({
            category: 'listings',
            templateId: 'categoryListWidget',
            defaultComponent: <CategoryListWidget data={item.categories}/>,
            props: {data: item.nav_menu}
        })
    }
    if (isSet(item["recent-posts"])) {
        return templateManager.getTemplateComponent({
            category: 'listings',
            templateId: 'recentPostsWidget',
            defaultComponent: <RecentPostsWidget data={item["recent-posts"]}/>,
            props: {data: item["recent-posts"]}
        })
    }
    if (isSet(item.email_optin_widget)) {
        return templateManager.getTemplateComponent({
            category: 'listings',
            templateId: 'emailOptinWidget',
            defaultComponent: <EmailOptinWidget data={item.email_optin_widget}/>,
            props: {data: item.email_optin_widget}
        })
    }

    return false;
}
