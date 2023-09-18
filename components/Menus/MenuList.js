import {connect} from "react-redux";
import React, {useContext} from 'react';
import {getPageDataMiddleware, setModalContentMiddleware} from "../../redux/middleware/page-middleware";
import Link from "next/link";
import {siteConfig} from "@/config/site-config";
import {logout} from "../../redux/actions/session-actions";
import {componentsConfig} from "@/config/components-config";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_STARTED} from "../../redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const MenuList = (props) => {

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const logoutHandler = (e) => {
        e.preventDefault();
        logout();
    }

    const pageClickHandler = (item, e) => {
        listingsManager.getSearchEngine().setSearchRequestStatusMiddleware(SEARCH_REQUEST_STARTED);
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
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
            <li>
                <Link href={item.post_url} onClick={
                        getCallback ? getCallback : pageClickHandler.bind(this, item)
                    }>
                    {item.post_title}
                </Link>
            </li>
        )

    }
    const getCollapseListItem = (item, subItems) => {
        return (
            <li className="has-children">
                <a>{item.menu_title} <i className="ti-angle-down"/></a>
                <ul className="submenu">
                    {subItems.map((subItem, subIndex) => (
                        <React.Fragment key={subIndex}>
                            {getListItem(subItem)}
                        </React.Fragment>
                    ))}
                </ul>
            </li>
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
        <ul id="navigation">
        {/*<ul className="site-menu js-clone-nav mr-auto d-none d-lg-block">*/}
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
        </ul>
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
)(MenuList);
