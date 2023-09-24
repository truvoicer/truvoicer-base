import React, {useContext, useEffect} from 'react';
import HorizontalTabLayout from "../tabs/HorizontalTabLayout";
import {connect} from "react-redux";
import {getUserAccountMenuAction} from "../../redux/actions/page-actions";
import VerticalTabLayout from "../tabs/VerticalTabLayout";
import {isNotEmpty} from "../../library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const UserAccountBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
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
        if (isNotEmpty(props.data?.tabs_orientation)) {
            return props.data.tabs_orientation;
        }
        return defaultTabOrientation;
    }
    useEffect(() => {
        getUserAccountMenuAction()
        // console.log(props.session[SESSION_AUTHENTICATED])
    }, [])  //TODO Login form appears on page load if user is authenticated
    console.log({props, tabData})
    function defaultView() {
        return (
            <div className={"user-account-area"}>
                {tabData.length > 0 &&
                    <>
                        {getTabOrientation() === "vertical" &&
                            <VerticalTabLayout
                                data={tabData}
                                tabIndex={getPageIndex()}
                                tabsBgImage={props.siteSettings?.sidebar_background_image}
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

    return templateManager.getTemplateComponent({
        category: 'account',
        templateId: 'userAccountBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            tabData: tabData,
            getPageIndex: getPageIndex,
            getTabOrientation: getTabOrientation,
            buildTabLayoutData: buildTabLayoutData,
        }
    })
}

function mapStateToProps(state) {
    // console.log(state.page)
    return {
        siteSettings: state.page.siteSettings,
        blockData: state.page.blocksData,
        userAccountMenu: state.page.userAccountMenu
    };
}

export default connect(
    mapStateToProps,
    null
)(UserAccountBlock);
