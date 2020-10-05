import React, {useEffect} from 'react';
import HorizontalTabLayout from "../tabs/HorizontalTabLayout";
import {connect} from "react-redux";
import {getUserAccountMenuAction} from "../../redux/actions/page-actions";
import VerticalTabLayout from "../tabs/VerticalTabLayout";
import {isNotEmpty, isSet} from "../../library/utils";

const UserAccountBlock = (props) => {
    const defaultTabOrientation = "horizontal";

    const buildTabLayoutData = (menuData) => {
        return menuData.map((item) => {
            return {
                page_name: item.menu_item?.post_name,
                url: item.menu_item?.post_url,
                tab_label: item.menu_item?.blocks_data?.tru_fetcher_user_area?.tab_label,
                panel_heading: item.menu_item?.blocks_data?.tru_fetcher_user_area?.heading,
                tab_component: item.menu_item?.blocks_data?.tru_fetcher_user_area?.component,
            }
        });
    }

    const getPageIndex = () => {
        let tabIndex = 0;
        tabData.map( (item, index) => {
            if(item.tab_component === props.data?.component) {
                tabIndex = index
            }
        });
        return tabIndex;
    }
    const tabData = buildTabLayoutData(props.userAccountMenu);

    const getTabOrientation = () => {
        if (isSet(props.userAccountSettings) && isNotEmpty(props.userAccountSettings.tabs_orientation)) {
            return props.userAccountSettings.tabs_orientation;
        }
        return defaultTabOrientation;
    }
    useEffect(() => {
        getUserAccountMenuAction()
        // console.log(props.session[SESSION_AUTHENTICATED])
    }, [])  //TODO Login form appears on page load if user is authenticated
    return (
            <div className={"user-account-area"}>
                {tabData.length > 0 &&
                    <>
                        {getTabOrientation() === "vertical" &&
                            <VerticalTabLayout
                                data={tabData}
                                tabIndex={getPageIndex()}
                                tabsBgImage={props.userAccountSettings.sidebar_background_image}
                            />
                        }
                        {getTabOrientation() === "horizontal" &&
                            <HorizontalTabLayout
                                data={tabData}
                                tabIndex={getPageIndex()}
                            />
                        }
                    </>
                }
            </div>
    );
}

function mapStateToProps(state) {
    // console.log(state.page)
    return {
        userAccountSettings: state.page.siteSettings.user_account_settings,
        blockData: state.page.blocksData,
        userAccountMenu: state.page.userAccountMenu
    };
}

export default connect(
    mapStateToProps,
    null
)(UserAccountBlock);