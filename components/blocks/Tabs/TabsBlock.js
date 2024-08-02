import React, {useContext} from "react";
import {connect} from "react-redux";
import CustomTabsBlock from "./CustomTabsBlock";
import RequestCarouselTabsBlock from "./RequestCarouselTabsBlock";
import RequestVideoTabsBlock from "./RequestVideoTabsBlock";
import UserAccountLoader from "@/truvoicer-base/components/loaders/UserAccountLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";

const TabsBlock = (props) => {

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getTabBlock = () => {
        switch (props.data.tabs_block_type) {
            case "request_video_tabs":
                return templateManager.render(<RequestVideoTabsBlock data={props.data} />);
                // return null
            case "request_carousel_tabs":
                return templateManager.render(<RequestCarouselTabsBlock data={props.data} />);
            case "custom_tabs":
                return templateManager.render(<CustomTabsBlock data={props.data} />);
        }
    }


    return (
        <>
            {props.data?.access_control === 'protected'
                ? (
                    <UserAccountLoader
                        fields={UserAccountHelpers.getFields()}
                    >
                        {getTabBlock()}
                    </UserAccountLoader>
                )
                : getTabBlock()
            }
        </>
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
