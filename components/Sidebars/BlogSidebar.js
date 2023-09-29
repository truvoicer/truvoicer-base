import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {buildSidebar} from "../../redux/actions/sidebar-actions";
import {getSidebar} from "../../library/api/wp/middleware";
import {siteConfig} from "@/config/site-config";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
const BlogSidebar = (props) => {
    const [data, setData] = useState([]);
    const { sidebarData, isLoading, isError } = getSidebar(siteConfig.blogSidebarName)

    const templateContext = useContext(TemplateContext);
    const templateManager = new TemplateManager(templateContext);

    useEffect(() => {
        setData(buildSidebar({
            sidebarData: sidebarData,
            templateContext,
        }))
    }, [sidebarData])

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
        );
    }
    return templateManager.getTemplateComponent({
        category: 'sidebars',
        templateId: 'blogSidebar',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            data: data,
            setData: setData,
            sidebarData: sidebarData,
            isLoading: isLoading,
            isError: isError,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    null,
    null
)(BlogSidebar);
