import {connect} from "react-redux";
import React, {useContext} from 'react';
import {
    getPageDataMiddleware,
    setModalContentMiddleware
} from "../../redux/middleware/page-middleware";
import {useRouter} from "next/router";
import {siteConfig} from "@/config/site-config";
import {logout} from "../../redux/actions/session-actions";
import {componentsConfig} from "@/config/components-config";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_STARTED} from "../../redux/constants/search-constants";
import Dropdown from "react-bootstrap/Dropdown";
import {CustomDropdownMenu} from "../dropdown/CustomDropdown";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/components/blocks/listings/contexts/SearchContext";
import {ItemContext} from "@/truvoicer-base/components/blocks/listings/contexts/ItemContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const sprintf = require("sprintf").sprintf
const DropdownMenuList = (props) => {
    const router = useRouter();

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const itemContext = useContext(ItemContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext, itemContext);

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
        props.setModalContentMiddleware(componentsConfig.components.authentication_login.name, {}, true)
    }
    const showAuthRegisterModal = () => {
        props.setModalContentMiddleware(componentsConfig.components.authentication_register.name, {}, true)
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
        <Dropdown.Menu alignRight={true} as={CustomDropdownMenu}>
            {props.data.menu_items.map((item, index) => (
                <React.Fragment key={index}>
                    {!siteConfig.authenticatedItems.includes(item.menu_item.post_type) &&
                    !siteConfig.notAuthenticatedItems.includes(item.menu_item.post_type) &&
                    getMenuItem(item)
                    }
                </React.Fragment>
            ))}
            {props.data.menu_items.map((item, index) => (
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

export default connect(
    mapStateToProps,
    {
        getPageDataMiddleware,
        setModalContentMiddleware
    }
)(DropdownMenuList);
