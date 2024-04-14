
import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {buildSidebar} from "/truvoicer-base/redux/actions/sidebar-actions";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import Left from "@/truvoicer-base/components/blocks/listings/sidebars/Left";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import BlogSearch from "@/truvoicer-base/components/widgets/BlogSearch";
import {isSet} from "@/truvoicer-base/library/utils";
import SidebarMenu from "@/truvoicer-base/components/Menus/SidebarMenu";
import CategoryListWidget from "@/truvoicer-base/components/widgets/CategoryListWidget";
import RecentPostsWidget from "@/truvoicer-base/components/widgets/RecentPostsWidget";
import EmailOptinWidget from "@/truvoicer-base/components/widgets/EmailOptinWidget";

const Sidebar = ({name}) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const [data, setData] = useState([]);

    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(name);
            const sidebar = fetchSidebar?.sidebar;
            if (Array.isArray(sidebar)) {
                console.log({sidebar})
                setData(sidebar);
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    function buildGroupBlock({groupData}) {
        let widgets = [];
        if (Array.isArray(groupData) && groupData.length > 0) {
            console.log({groupData})
            groupData.forEach((item, index) => {
                const widgetComponent = getSidebarWidgetComponent({
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
            console.log({groupData})
            groupData.forEach((item, index) => {
                widgets = [
                    ...widgets,
                    ...buildGroupBlock({groupData: item['innerBlocks']})
                ];
            })
        }
        return widgets;
    }
    const getSidebarWidgetComponent = ({item}) => {
        if (item?.['core/search'] || item?.blockName === 'core/search') {
            return <BlogSearch data={item['core/search']}/>
        }
        if (item?.['core/group'] || item?.blockName === 'core/group') {
            return buildGroupWidgets({groupData: item['core/group']})
        }
        if (item?.['core/heading'] || item?.blockName === 'core/heading') {
            return <BlogSearch data={item['core/heading']}/>
        }
        if (isSet(item.nav_menu) || item?.blockName === 'core/navigation') {
            return <SidebarMenu data={item.nav_menu}/>
        }
        if (isSet(item.categories) || item?.blockName === 'core/categories') {
            return <CategoryListWidget data={item.categories}/>
        }
        if (isSet(item["core/recent-posts"]) || item?.blockName === 'core/recent-posts') {
            return <RecentPostsWidget data={item["core/recent-posts"]}/>
        }
        if (isSet(item["core/latest-posts"])) {
            return <RecentPostsWidget data={item["core/latest-posts"]}/>
        }
        if (isSet(item.email_optin_widget)) {
            return <EmailOptinWidget data={item.email_optin_widget}/>
        }

        return null;
    }

    useEffect(() => {
        sidebarRequest();
    }, []);


        return (
            <div className="job_filter white-bg">
                <div className="form_inner white-bg">

                    {data.map((item, index) => {
                        const widgetComponent = getSidebarWidgetComponent({item});
                        if (Array.isArray(widgetComponent) && widgetComponent.length > 0) {
                            return (
                                <React.Fragment key={index.toString()}>
                                    {widgetComponent.map((subItem, subIndex) => {
                                        return (
                                            <React.Fragment key={index.toString()}>
                                                {templateManager.render(subItem)}
                                            </React.Fragment>
                                        )
                                    })}
                                </React.Fragment>
                            )
                        }
                        return (
                            <React.Fragment key={index.toString()}>
                                {templateManager.render(widgetComponent)}
                            </React.Fragment>
                        )
                    })}
                    <Left />
                </div>
            </div>
        )
}

function mapStateToProps(state) {
    return {};
}
Sidebar.category = 'sidebars';
Sidebar.templateId = 'leftSidebar';
export default connect(
    mapStateToProps,
    null
)(Sidebar);
