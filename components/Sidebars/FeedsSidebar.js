import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import {getSidebar} from "../../library/api/wp/middleware";
import LoaderComponent from "../loaders/Loader";
import Error from "next";
import {siteConfig} from "@/config/site-config";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";

const FeedsSidebar = (props) => {
    const listingsContext = useContext(ListingsContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const {sidebarData, isLoading, isError} = getSidebar(siteConfig.feedsSidebarName)
    const [data, setData] = useState(buildSidebar({
        sidebarData: sidebarData,
    }));

    if (isLoading) return <LoaderComponent/>
    if (isError) return <Error/>

    function defaultView() {
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

    return templateManager.getTemplateComponent({
        category: 'sidebars',
        templateId: 'feedsSidebar',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            sidebarData,
            isLoading,
            isError,
            data,
            setData,
            ...props
        }
    })
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(FeedsSidebar);
