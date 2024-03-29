import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import {siteConfig} from "@/config/site-config";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const FeedsSidebar = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const [data, setData] = useState([]);

    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(siteConfig.feedsSidebarName);
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
                </div>
            </div>
        )
}

function mapStateToProps(state) {
    return {};
}

FeedsSidebar.category = 'sidebars';
FeedsSidebar.templateId = 'feedsSidebar';
export default connect(
    mapStateToProps,
    null
)(FeedsSidebar);
