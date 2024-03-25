
import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {buildSidebar} from "/truvoicer-base/redux/actions/sidebar-actions";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import Left from "@/truvoicer-base/components/blocks/listings/sidebars/Left";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const LeftSidebar = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const [data, setData] = useState([]);

    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(siteConfig.leftSidebarName);
            const sidebar = fetchSidebar?.sidebar;
            if (Array.isArray(sidebar)) {

                setData(buildSidebar({
                    sidebarData: sidebar,
                }))
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    useEffect(() => {
        sidebarRequest();
    }, []);

    function defaultView() {
        return (
            <div className="job_filter white-bg">
                <div className="form_inner white-bg">

                    {data.map((item, index) => (
                        <React.Fragment key={index.toString()}>
                            {item}
                        </React.Fragment>
                    ))}

                    <Left />
                </div>
            </div>
        )
    }
    return templateManager.getTemplateComponent({
        category: 'sidebars',
        templateId: 'leftSidebar',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            data: data,
            setData: setData,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(LeftSidebar);
