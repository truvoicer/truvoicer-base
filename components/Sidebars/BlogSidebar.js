import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import {getSidebar} from "../../library/api/wp/middleware";
import {siteConfig} from "@/config/site-config";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
const BlogSidebar = () => {
    const [data, setData] = useState([]);
    const { sidebarData, isLoading, isError } = getSidebar(siteConfig.blogSidebarName)

    const templateContext = useContext(TemplateContext);

    useEffect(() => {
        setData(buildSidebar({
            sidebarData: sidebarData,
            templateContext,
        }))
    }, [sidebarData])

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

export default connect(
    null,
    null
)(BlogSidebar);
