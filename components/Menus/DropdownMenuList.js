import {connect} from "react-redux";
import React, {useContext} from 'react';
import {
    getPageDataMiddleware
} from "../../redux/middleware/page-middleware";
import {useRouter} from "next/navigation";
import {siteConfig} from "@/config/site-config";
import {logout} from "../../redux/actions/session-actions";
import {blockComponentsConfig} from "@/truvoicer-base/config/block-components-config";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_STARTED} from "../../redux/constants/search-constants";
import Dropdown from "react-bootstrap/Dropdown";
import CustomDropdownMenu from "../dropdown/CustomDropdownMenu";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";

const sprintf = require('sprintf-js').sprintf
const DropdownMenuList = (props) => {
    const router = useRouter();

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const modalContext = useContext(AppModalContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const logoutHandler = (e) => {
        e.preventDefault();
        logout();
    }

    const pageClickHandler = (item, e) => {
        e.preventDefault()
        listingsManager.getSearchEngine().setSearchRequestStatusMiddleware(SEARCH_REQUEST_STARTED);
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        router.push(item.post_url, item.post_url)
    }

    const showAuthLoginModal = () => {
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_login.name,
            show: true
        });
    }
    const showAuthRegisterModal = () => {
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_register.name,
            show: true
        });
    }

    const getListItem = (item) => {
        const getCallback = getItemCallback(item.post_type);
        return (
            <Dropdown.Item
                onClick={
                    getCallback ? getCallback : pageClickHandler.bind(this, item)
                }
                eventKey={item.post_name}
            >
                {item.post_title}
            </Dropdown.Item>
        )

    }
    const getCollapseListItem = (item, subItems) => {
        return (
            <>
                {subItems.map((subItem, subIndex) => (
                    <React.Fragment key={subIndex}>
                        {getListItem(subItem)}
                    </React.Fragment>
                ))}
            </>
        );
    }

    const getMenuItem = (item) => {
        return (
            <>
                {item.menu_sub_items
                    ?
                    <>
                        {getCollapseListItem(item.menu_item, item.menu_sub_items)}
                    </>
                    :
                    <>
                        {getListItem(item.menu_item)}
                    </>
                }
            </>
        )
    }

    const getItemCallback = (pageType) => {
        switch (pageType) {
            case "register":
                return showAuthRegisterModal;
            case "login":
                return showAuthLoginModal;
            case "logout":
                return logoutHandler;
            default:
                return false;
        }
    }

    return (
        <Dropdown.Menu alignRight={true} as={templateManager.render(CustomDropdownMenu)}>
            {Array.isArray(props?.data?.menu_items) && props.data.menu_items.map((item, index) => (
                <React.Fragment key={index}>
                    {!siteConfig.authenticatedItems.includes(item.menu_item.post_type) &&
                    !siteConfig.notAuthenticatedItems.includes(item.menu_item.post_type) &&
                    getMenuItem(item)
                    }
                </React.Fragment>
            ))}
            {Array.isArray(props?.data?.menu_items) && props.data.menu_items.map((item, index) => (
                <React.Fragment key={index}>
                    {props.sessionLinks && props.session.authenticated &&
                    <>
                        {siteConfig.authenticatedItems.includes(item.menu_item.post_type) &&
                        getMenuItem(item)
                        }
                    </>
                    }
                    {props.sessionLinks && !props.session.authenticated &&
                    <>
                        {siteConfig.notAuthenticatedItems.includes(item.menu_item.post_type) &&
                        getMenuItem(item)
                        }
                    </>
                    }
                </React.Fragment>
            ))}
        </Dropdown.Menu>
    )
}

function mapStateToProps(state) {
    return {
        session: state.session
    };
}
DropdownMenuList.category = 'menus';
DropdownMenuList.templateId = 'dropdownMenuList';
export default connect(
    mapStateToProps,
    {
        getPageDataMiddleware,
    }
)(DropdownMenuList);
