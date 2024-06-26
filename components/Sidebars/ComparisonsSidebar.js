import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const ComparisonsSidebar = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const [data, setData] = useState([]);

    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(siteConfig.comparisonsSidebarName);
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

    const getContent = () => {
        return (
            <div className="comparisons-sidebar job_filter white-bg">
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


        return (
            <>{getContent()}</>
        )

}

function mapStateToProps(state) {
    return {};
}
ComparisonsSidebar.category = 'sidebars';
ComparisonsSidebar.templateId = 'comparisonsSidebar';
export default connect(
    mapStateToProps,
    null
)(ComparisonsSidebar);
