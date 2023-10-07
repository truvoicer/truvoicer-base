import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {buildWpApiUrl, fetcher, getSidebar} from "@/truvoicer-base/library/api/wp/middleware";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import Error from "next";
import {siteConfig} from "@/config/site-config";
import {buildSidebar} from "/truvoicer-base/redux/actions/sidebar-actions";
import useSWR from "swr";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import Left from "@/truvoicer-base/components/blocks/listings/sidebars/Left";

const RightSidebar = (props) => {
    const [data, setData] = useState([]);
    const { data: sidebarData, error: sidebarError } = useSWR(buildWpApiUrl(wpApiConfig.endpoints.sidebar, siteConfig.rightSidebarName), fetcher)

    const listingsContext = useContext(ListingsContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    useEffect(() => {
        if (Array.isArray(sidebarData?.sidebar)) {
            setData(
                buildSidebar({
                    sidebarData: sidebarData.sidebar,
                })
            )
        }
    }, [sidebarData])

    const sidebarLoading = !sidebarError && !sidebarData
    if (sidebarLoading) return <></>
    if (sidebarError) return <Error />

    function defaultView() {
        return (
            <div className="job_filter white-bg">
                <div className="form_inner white-bg">

                    {data.map((item, index) => (
                        <React.Fragment key={index.toString()}>
                            {item}
                        </React.Fragment>
                    ))}

                    <Left />
                </div>
            </div>
        )
    }
    return templateManager.getTemplateComponent({
        category: 'sidebars',
        templateId: 'rightSidebar',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            data: data,
            setData: setData,
            sidebarData: sidebarData,
            sidebarError: sidebarError,
            sidebarLoading: sidebarLoading,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(RightSidebar);
