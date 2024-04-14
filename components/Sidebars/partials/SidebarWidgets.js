import React from 'react';
import BlogSearch from "@/truvoicer-base/components/widgets/BlogSearch";
import HeadingWidget from "@/truvoicer-base/components/widgets/HeadingWidget";
import {isSet} from "@/truvoicer-base/library/utils";
import SidebarMenu from "@/truvoicer-base/components/Menus/SidebarMenu";
import CategoryListWidget from "@/truvoicer-base/components/widgets/CategoryListWidget";
import RecentPostsWidget from "@/truvoicer-base/components/widgets/RecentPostsWidget";
import EmailOptinWidget from "@/truvoicer-base/components/widgets/EmailOptinWidget";
import ListingsFilterInterface from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsFilterInterface";

function buildGroupBlock({groupData}) {
    let widgets = [];
    if (Array.isArray(groupData) && groupData.length > 0) {
        console.log({groupData})
        groupData.forEach((item, index) => {
            const widgetComponent = getSidebarWidget({
                item: item
            })
            if (widgetComponent) {
                widgets.push(widgetComponent)
            }
        })
    }
    return widgets;
}

function buildGroupWidgets({groupData}) {
    let widgets = [];
    if (Array.isArray(groupData) && groupData.length > 0) {
        groupData.forEach((item, index) => {
            widgets = [
                ...widgets,
                ...buildGroupBlock({groupData: item['innerBlocks']})
            ];
        })
    }
    return widgets;
}
export function getSidebarWidget({item}) {

        if (item?.['core/search'] || item?.blockName === 'core/search') {
            return {
                title: 'Search',
                component: <BlogSearch data={item['core/search']}/>
            };
        }
        if (item?.['core/group'] || item?.blockName === 'core/group') {
            return buildGroupWidgets({groupData: item['core/group']})
        }
        if (item?.['core/heading'] || item?.blockName === 'core/heading') {
            return {
                title: 'heading',
                component: <HeadingWidget html={item?.innerHTML} />
            };
        }
        if (isSet(item.nav_menu) || item?.blockName === 'core/navigation') {
            return {
                title: '',
                component: <SidebarMenu data={item.nav_menu}/>
            };
        }
        if (isSet(item.categories) || item?.blockName === 'core/categories') {
            return {
                title: '',
                component: <CategoryListWidget data={item.categories}/>
            };
        }
        if (isSet(item["core/recent-posts"]) || item?.blockName === 'core/recent-posts') {
            return {
                title: 'Recent Posts',
                component: <RecentPostsWidget data={item["core/recent-posts"]}/>
            };
        }
        if (isSet(item["core/latest-posts"]) || item?.blockName === 'core/latest-posts') {
            return {
                title: 'Latest Posts',
                component: <RecentPostsWidget data={item["core/latest-posts"]}/>
            };
        }
        if (isSet(item.email_optin_widget) || item?.blockName === 'email_optin_widget') {
            return {
                title: '',
                component: <EmailOptinWidget data={item.email_optin_widget}/>
            };
        }
        if (item.hasOwnProperty('listings_filter_widget') || item?.blockName === 'listings_filter_widget') {
            return {
                hasWidgetContainer: false,
                component: <ListingsFilterInterface />
            };
        }

        return null;
    }

