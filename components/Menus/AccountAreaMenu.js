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
import {getFontAwesomeMenuIcon} from "../../library/utils";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/components/blocks/listings/contexts/SearchContext";
import {ItemContext} from "@/truvoicer-base/components/blocks/listings/contexts/ItemContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const AccountAreaMenu = (props) => {
    const router = useRouter();

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const itemContext = useContext(ItemContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

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
            <a
                onClick={
                    getCallback ? getCallback : pageClickHandler.bind(this, item)
                }
                className="bg-dark list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-start align-items-center">
                    <span className={`fa ${getFontAwesomeMenuIcon("myAccountMenu", item.post_name, "fa-bars")} fa-fw mr-3`}/>
                    <span className="menu-collapsed">{item.post_title}</span>
                </div>
            </a>
        )

    }
    const getCollapseListItem = (item, subItems) => {
        const getItemCallback = getItemCallback(item.post_type);
        return (
            <>
                <a
                    onClick={getItemCallback ? getItemCallback : pageClickHandler.bind(this, item)}
                    data-toggle="collapse"
                    aria-expanded="false"
                    className="bg-dark list-group-item list-group-item-action flex-column align-items-start"
                >
                    <div className="d-flex w-100 justify-content-start align-items-center">
                        <span className="fa fa-dashboard fa-fw mr-3"/>
                        <span className="menu-collapsed">{item.menu_title}</span>
                        <span className="submenu-icon ml-auto"/>
                    </div>
                </a>
                <div id='submenu1' className="collapse sidebar-submenu">
                    {subItems.map((subItem, subIndex) => {
                        const getSubItemCallback = getItemCallback(subItem.post_type);
                        return (
                            <a
                                key={subIndex}
                                onClick={
                                    getSubItemCallback ? getSubItemCallback : pageClickHandler.bind(this, subItem)
                                }
                                className="list-group-item list-group-item-action bg-dark text-white"
                            >
                                <span className="menu-collapsed">{subItem.post_title}</span>
                            </a>
                        )
                    })}
                </div>
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
        <ul className="list-group">
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
)(AccountAreaMenu);
