import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import CustomTabsBlock from "./CustomTabsBlock";
import RequestCarouselTabsBlock from "./RequestCarouselTabsBlock";
import RequestVideoTabsBlock from "./RequestVideoTabsBlock";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ComponentLoader from "@/truvoicer-base/components/loaders/ComponentLoader";
import {isNotEmpty, isObject} from "@/truvoicer-base/library/utils";
import WpDataLoaderDataContext from "@/truvoicer-base/components/loaders/contexts/WpDataLoaderDataContext";
import {FormHelpers} from "@/truvoicer-base/library/helpers/FormHelpers";

const TabsBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const wpDataLoaderContext = useContext(WpDataLoaderDataContext);

    const formHelpers = new FormHelpers();
    formHelpers.setValues(wpDataLoaderContext.data);

    async function formBlockInit(formBlockData) {
        const formType = formBlockData?.form_type;
        let formFields = [];
        let form = {
            type: formType,
        };

        switch (formType) {
            case 'single':
                formBlockData?.form_rows.forEach(row => {
                    if (!Array.isArray(row?.form_items)) {
                        return;
                    }
                    row?.form_items.forEach(item => {
                        if (!isNotEmpty(item?.form_control)) {
                            return;
                        }
                        if (!isNotEmpty(item?.name)) {
                            return;
                        }
                        formFields.push({
                            form_control: item.form_control,
                            name: item.name
                        })
                    });
                });
                if (formFields.length === 0) {
                    return;
                }
                form.fields = formFields;
                break;
            case 'list':
                form.id = formBlockData?.form_id;
                break;
        }
        await wpDataLoaderContext.requestFields({
            endpoint: formBlockData?.endpoint,
            form
        })
    }
    function tabInit(activeKey) {
        const tab = props.data.tabs[activeKey]
        switch (tab?.custom_tabs_type) {
            case 'form':
                if (!isObject(tab?.form_block)) {
                    return;
                }
                formBlockInit(tab.form_block);
                break;
        }
    }
    const getDefaultActiveTab = () => {
        let tabIndex = 0;
        if (!Array.isArray(props.data.tabs)) {
            return tabIndex;
        }
        props.data.tabs.map((tab, index) => {
            if (tab?.default_active_tab) {
                tabIndex = index
            }
        });
        return tabIndex;
    }


    const tabProps = {
        defaultActiveKey: getDefaultActiveTab(),
        data: props.data,
        onSelect: activeKey => {
            tabInit(activeKey);
        }
    }

    const getTabBlock = () => {
        switch (props.data.tabs_block_type) {
            case "request_video_tabs":
                return templateManager.render(<RequestVideoTabsBlock {...tabProps} />);
                // return null
            case "request_carousel_tabs":
                return templateManager.render(<RequestCarouselTabsBlock {...tabProps} />);
            case "custom_tabs":
                return templateManager.render(<CustomTabsBlock {...tabProps} />);
        }
    }
    useEffect(() => {
        tabInit(getDefaultActiveTab());
    }, [props.data]);


    return (
        <ComponentLoader
            selfAccessControl={props?.data?.access_control}
            parentAccessControl={props?.parentAccessControl}>
            {getTabBlock()}
        </ComponentLoader>
    );
}

function mapStateToProps(state) {
    return {
        tabsData: state.page.blocksData?.tru_fetcher_tabs
    };
}

TabsBlock.category = 'tabs';
TabsBlock.templateId = 'tabsBlock';
export default connect(
    mapStateToProps
)(TabsBlock);
