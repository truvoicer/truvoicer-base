import React from "react";
import {connect} from "react-redux";
import CustomTabsBlock from "./CustomTabsBlock";
import RequestCarouselTabsBlock from "./RequestCarouselTabsBlock";
import RequestVideoTabsBlock from "./RequestVideoTabsBlock";
import UserAccountLoader from "@/truvoicer-base/components/loaders/UserAccountLoader";

const TabsBlock = (props) => {

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
    )
}

function mapStateToProps(state) {
    return {
        tabsData: state.page.blocksData?.tru_fetcher_tabs
    };
}

export default connect(
    mapStateToProps
)(TabsBlock);
