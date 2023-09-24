import React, {useContext} from "react";
import {connect} from "react-redux";
import CustomTabsBlock from "./CustomTabsBlock";
import RequestCarouselTabsBlock from "./RequestCarouselTabsBlock";
import RequestVideoTabsBlock from "./RequestVideoTabsBlock";
import UserAccountLoader from "@/truvoicer-base/components/loaders/UserAccountLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const TabsBlock = (props) => {

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getTabBlock = () => {
        switch (props.data.tabs_block_type) {
            case "request_video_tabs":
                return <RequestVideoTabsBlock data={props.data} />
                // return null
            case "request_carousel_tabs":
                return <RequestCarouselTabsBlock data={props.data} />
            case "custom_tabs":
                return <CustomTabsBlock data={props.data} />
        }
    }

    function defaultView() {
        return (
            <>
                {props.data?.access_control === 'protected'
                    ? (

                        <UserAccountLoader>
                            {getTabBlock()}
                        </UserAccountLoader>
                    )
                    : getTabBlock()
                }
            </>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'tabs',
        templateId: 'tabsBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getTabBlock: getTabBlock,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {
        tabsData: state.page.blocksData?.tru_fetcher_tabs
    };
}

export default connect(
    mapStateToProps
)(TabsBlock);
