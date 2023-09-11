import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import {getSidebar} from "../../library/api/wp/middleware";
import LoaderComponent from "../widgets/Loader";
import Error from "next";
import {siteConfig} from "@/config/site-config";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";

const FeedsSidebar = (props) => {
    const listingsContext = useContext(ListingsContext);
    const { sidebarData, isLoading, isError } = getSidebar(siteConfig.feedsSidebarName)
    const [data, setData] = useState(buildSidebar({sidebarData: sidebarData, listingsData: listingsContext?.listingsData}));

    if (isLoading) return <LoaderComponent />
    if (isError) return <Error />

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
    mapStateToProps,
    null
)(FeedsSidebar);
