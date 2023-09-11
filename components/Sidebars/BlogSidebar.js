import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import {getSidebar} from "../../library/api/wp/middleware";
import {siteConfig} from "../../../config/site-config";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
const BlogSidebar = () => {
    const [data, setData] = useState([]);
    const { sidebarData, isLoading, isError } = getSidebar(siteConfig.blogSidebarName)

    useEffect(() => {
        setData(buildSidebar({sidebarData: sidebarData}))
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
