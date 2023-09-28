import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {getSidebar} from "../../library/api/wp/middleware";
import LoaderComponent from "../widgets/Loader";
import Error from "next";
import {siteConfig} from "../../../config/site-config";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";

const ComparisonsSidebar = (props) => {
    const templateContext = useContext(TemplateContext);
    const listingsContext = useContext(ListingsContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const { sidebarData, isLoading, isError } = getSidebar(siteConfig.comparisonsSidebarName)

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(buildSidebar({
            sidebarData: sidebarData,
            listingsData: listingsContext?.listingsData,
            templateContext,
        }));
    }, [sidebarData])

    const getContent = () => {
        if (isLoading) return <LoaderComponent />
        if (isError) return <Error />
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

    function defaultView() {
    return (
        <>{getContent()}</>
    )
    }
    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'heroBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            buttonClickHandler: buttonClickHandler
        }
    })

}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(ComparisonsSidebar);
