
import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {buildSidebar} from "/truvoicer-base/redux/actions/sidebar-actions";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import Left from "@/truvoicer-base/components/blocks/listings/sidebars/Left";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const RightSidebar = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const [data, setData] = useState([]);

    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(siteConfig.rightSidebarName);
            const sidebar = fetchSidebar?.sidebar;
            if (Array.isArray(sidebar)) {

                setData(buildSidebar({
                    sidebarData: sidebar,
                    templateManager
                }))
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    useEffect(() => {
        sidebarRequest();
    }, []);


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

function mapStateToProps(state) {
    return {};
}
RightSidebar.category = 'sidebars';
RightSidebar.templateId = 'rightSidebar';
export default connect(
    mapStateToProps,
    null
)(RightSidebar);
