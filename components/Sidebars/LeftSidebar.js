import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {buildWpApiUrl, fetcher, getSidebar} from "../../library/api/wp/middleware";
import LoaderComponent from "../widgets/Loader";
import Error from "next";
import {siteConfig} from "@/config/site-config";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import useSWR from "swr";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";

const LeftSidebar = (props) => {
    const [data, setData] = useState([]);
    const { data: sidebarData, error: sidebarError } = useSWR(buildWpApiUrl(wpApiConfig.endpoints.sidebar, siteConfig.rightSidebarName), fetcher)

    const listingsContext = useContext(ListingsContext);

    useEffect(() => {
        if (Array.isArray(sidebarData?.sidebar)) {
            setData(buildSidebar({sidebarData: sidebarData.sidebar, listingsData: listingsContext?.listingsData}))
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
    return {};
}

export default connect(
    mapStateToProps,
    null
)(LeftSidebar);
