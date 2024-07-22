import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {buildSidebar} from "/truvoicer-base/redux/actions/sidebar-actions";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import WidgetGroup from "@/truvoicer-base/components/Sidebars/partials/WidgetGroup";
import WidgetContainer from "@/truvoicer-base/components/Sidebars/partials/WidgetContainer";
import {da} from "date-fns/locale";
import parse from "html-react-parser";
import HeadingWidget from "@/truvoicer-base/components/widgets/HeadingWidget";
import {getSidebarWidget} from "@/truvoicer-base/components/Sidebars/partials/SidebarWidgets";

const Sidebar = ({name}) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const [data, setData] = useState([]);

    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(name);
            const sidebar = fetchSidebar?.sidebar;
            if (Array.isArray(sidebar)) {
                setData(sidebar);
            }
        } catch (e) {
            console.warn(e.message);
        }
    }


    useEffect(() => {
        sidebarRequest();
    }, []);

    function buildWidgets(widgetData) {
        return widgetData.map((item, index) => {
            return getSidebarWidget({item});
        });
    }

    function renderWidgets(widgetData) {
        return (
            <>
                {widgetData.map((item, index) => {
                    if (Array.isArray(item) && item.length > 0) {
                        return templateManager.render(
                            <WidgetGroup key={index} widgets={item} />
                        )
                    }

                    if (!item) {
                        return null;
                    }

                    if (!item?.component) {
                        return null;
                    }
                    if (item?.hasWidgetContainer === false) {
                        return templateManager.render(item.component);
                    }
                    return templateManager.render(
                        <WidgetContainer key={index} title={item?.title || ''}>
                            {templateManager.render(item.component)}
                        </WidgetContainer>
                    )
                })}
            </>
        )
    }

    return (
        <div className="job_filter white-bg">
            <div className="form_inner white-bg">
                {renderWidgets(buildWidgets(data))}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {};
}

Sidebar.category = 'sidebars';
Sidebar.templateId = 'sidebar';
export default connect(
    mapStateToProps,
    null
)(Sidebar);
