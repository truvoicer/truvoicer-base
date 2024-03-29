import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {siteConfig} from "@/config/site-config";
import {buildSidebar} from "../../../../redux/actions/sidebar-actions";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import ListingsFilter from "@/truvoicer-base/components/blocks/listings/filters/ListingsFilter";
import Left from "@/truvoicer-base/components/blocks/listings/sidebars/Left";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {AppContext} from "@/truvoicer-base/config/contexts/AppContext";
import {AppManager} from "@/truvoicer-base/library/app/AppManager";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const ListingsLeftSidebar = (props) => {
    const {sidebarName} = props;
    const [data, setData] = useState([]);
    const appContext = useContext(AppContext);
    const appManager = new AppManager(appContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const fetchListingsContextGroups = appManager.findContextGroupsByContextId("listingsContext");
    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(
            (isNotEmpty(sidebarName)) ? sidebarName : siteConfig.leftSidebarName,
            );
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
    }, [sidebarName]);


        return (
            <div className="job_filter white-bg">
                <div className="form_inner white-bg">
                    <Left />
                    {templateManager.render(<ListingsFilter listingsContextGroup={{fetchListingsContextGroups}}/>)}
                    {data.map((item, index) => (
                        <React.Fragment key={index.toString()}>
                            {item}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        )
}
ListingsLeftSidebar.category = 'listings';
ListingsLeftSidebar.templateId = 'listingsLeftSidebar';
function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(ListingsLeftSidebar);
