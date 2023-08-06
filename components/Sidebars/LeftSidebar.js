import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {buildWpApiUrl, fetcher, getSidebar} from "../../library/api/wp/middleware";
import LoaderComponent from "../widgets/Loader";
import Error from "next";
import {siteConfig} from "../../../config/site-config";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import useSWR from "swr";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";

const LeftSidebar = (props) => {
    const [data, setData] = useState([]);
    const { data: sidebarData, error: sidebarError } = useSWR(buildWpApiUrl(wpApiConfig.endpoints.sidebar, siteConfig.rightSidebarName), fetcher)

    useEffect(() => {
        if (Array.isArray(sidebarData?.sidebar)) {
            setData(buildSidebar({sidebarData: sidebarData.sidebar, listingsData: props.listings.listingsData}))
        }
    }, [sidebarData])

    const sidebarLoading = !sidebarError && !sidebarData
    if (sidebarLoading) return <></>
    if (sidebarError) return <Error />

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
    return {
        listings: state.listings
    };
}

export default connect(
    mapStateToProps,
    null
)(LeftSidebar);
