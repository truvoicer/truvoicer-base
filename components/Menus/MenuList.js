import { connect } from "react-redux";
import React, { useContext } from 'react';
import { getPageDataMiddleware } from "../../redux/middleware/page-middleware";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { logout } from "../../redux/actions/session-actions";
import { blockComponentsConfig } from "@/truvoicer-base/config/block-components-config";
import { SEARCH_REQUEST_NEW, SEARCH_STATUS_STARTED } from "../../redux/constants/search-constants";
import { ListingsContext } from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import { SearchContext } from "@/truvoicer-base/library/listings/contexts/SearchContext";
import { ListingsManager } from "@/truvoicer-base/library/listings/listings-manager";
import { TemplateManager } from "@/truvoicer-base/library/template/TemplateManager";
import { TemplateContext } from "@/truvoicer-base/config/contexts/TemplateContext";
import { AppModalContext } from "@/truvoicer-base/config/contexts/AppModalContext";
import { SessionContext } from "@/truvoicer-base/config/contexts/SessionContext";
import { AppContext } from "@/truvoicer-base/config/contexts/AppContext";
import { AppManager } from "@/truvoicer-base/library/app/AppManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { setAppLoadedAction } from "@/truvoicer-base/redux/actions/app-actions";
import { setAppRequestedRoute } from "@/truvoicer-base/redux/reducers/app-reducer";
import Nav from "react-bootstrap/Nav";
import { NavDropdown } from "react-bootstrap";

const MenuList = (props) => {
    const appContext = useContext(AppContext);
    const appManager = new AppManager(appContext);
    const listingsContext = appManager.findAppContextById('listings_block_0', "listingsContext");
    const searchContext = appManager.findAppContextById('listings_block_0', "searchContext");


    const modalContext = useContext(AppModalContext);
    const sessionContext = useContext(SessionContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const logoutHandler = (e) => {
        e.preventDefault();
        sessionContext.logout(props?.session?.user);
        logout();
    }

    const pageClickHandler = (e, item, preventDefault = false) => {
        if (preventDefault) {
            e.preventDefault();
            if (!e.target.classList.contains('dropdown-toggle')) {
                return;
            }
            let parentEle = e.target.parentElement;
            if (!parentEle) {
                return;
            }
            let findUl = parentEle.querySelector('ul.dropdown-menu');
            if (!findUl) {
                return;
            }
            if (findUl.style.display !== 'block') {
                findUl.style.display = 'block';
            } else {
                findUl.style.display = '';
            }
            return;
        }

        setAppLoadedAction(false);
        setAppRequestedRoute(item?.post_url);
    }

    const showAuthLoginModal = (e) => {
        e.preventDefault();
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_login.name,
            componentProps: {
                heading: null,
            },
            title: siteConfig.loginHeading,
            show: true,
            showFooter: false
        });
    }
    const showAuthRegisterModal = (e) => {
        e.preventDefault();
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_register.name,
            componentProps: {
                heading: null,
            },
            title: siteConfig.registerHeading,
            show: true,
            showFooter: false
        });
    }

    const getDropdownListItem = (item) => {
        const getCallback = getItemCallback(item.post_type);
        return (

            <NavDropdown.Item as={'li'} className="dropdown-submenu">
                <Link href={item?.post_url || '#'} 
                    onClick={e => {
                        if (getCallback) {
                            getCallback(e);
                        } else {
                            pageClickHandler(e, item, true);
                        }
                    }}>
                    {item.post_title}
                </Link>
            </NavDropdown.Item>
        )

    }

    const getListItem = (item) => {
        const getCallback = getItemCallback(item.post_type);
        return (
            <li className="nav-item dropdown mega-dropdown">
                <Link className="nav-link dropdown-toggle"
                    href={item?.post_url || '#'} 
                    onClick={e => {
                        if (getCallback) {
                            getCallback(e);
                        } else {
                            pageClickHandler(e, item);
                        }
                    }}>
                    {item.post_title}
                </Link>
            </li>
        )

    }
    const getDropdownSubMenuListItem = (item, subItems) => {
        const getCallback = getItemCallback(item.post_type);
        return (
            <li className="dropdown-submenu">
                <Link className="dropdown-toggle"
                    href={'#'} 
                    onClick={e => {
                        if (getCallback) {
                            getCallback(e);
                        } else {
                            pageClickHandler(e, item, true);
                        }
                    }}>
                    {item.post_title}
                    <FontAwesomeIcon icon={faAngleDown} />
                </Link>

                <ul className="dropdown-menu">
                    {subItems.map((subItem, subIndex) => (
                        <React.Fragment key={subIndex}>
                            {getMenuItem(subItem, false)}
                        </React.Fragment>
                    ))}
                </ul>
            </li>
        );
    }
    const getCollapseListItem = (item, subItems) => {
        const getCallback = getItemCallback(item.post_type);
        return (
            <li className="dropdown">
                <Link className="dropdown-toggle"
                    href={'#'} 
                    onClick={e => {
                        if (getCallback) {
                            getCallback(e);
                        } else {
                            pageClickHandler(e, item, true);
                        }
                    }}>
                    {item.post_title}
                    <FontAwesomeIcon icon={faAngleDown} />
                </Link>
                <ul className="dropdown-menu">
                    {subItems.map((subItem, subIndex) => (
                        <React.Fragment key={subIndex}>
                            {getMenuItem(subItem, true)}
                        </React.Fragment>
                    ))}
                </ul>
            </li>
        );
    }

    const getMenuItem = (item, dropdown = false) => {
        if (item.menu_sub_items) {
            if (dropdown) {
                return getDropdownSubMenuListItem(item.menu_item, item.menu_sub_items);
            } else {
                return getCollapseListItem(item.menu_item, item.menu_sub_items);
            }
        }
        if (dropdown) {
            return getDropdownListItem(item.menu_item);
        }
        return getListItem(item.menu_item);
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
        <ul className="nav navbar-nav">
            {/*<ul className="site-menu js-clone-nav mr-auto d-none d-lg-block">*/}
            {Array.isArray(props?.data?.menu_items) && props.data.menu_items.map((item, index) => (
                <React.Fragment key={index}>
                    {item?.menu_item?.post_type &&
                        !siteConfig.authenticatedItems.includes(item.menu_item.post_type) &&
                        !siteConfig.notAuthenticatedItems.includes(item.menu_item.post_type) &&
                        getMenuItem(item)
                    }
                </React.Fragment>
            ))}
            {Array.isArray(props?.data?.menu_items) && props.data.menu_items.map((item, index) => (
                <React.Fragment key={index}>
                    {props.sessionLinks && props.session.authenticated &&
                        <>
                            {item?.menu_item?.post_type && siteConfig.authenticatedItems.includes(item.menu_item.post_type) &&
                                getMenuItem(item)
                            }
                        </>
                    }
                    {props.sessionLinks && !props.session.authenticated &&
                        <>
                            {item?.menu_item?.post_type && siteConfig.notAuthenticatedItems.includes(item.menu_item.post_type) &&
                                getMenuItem(item)
                            }
                        </>
                    }
                </React.Fragment>
            ))}
        </ul>
    );
}

function mapStateToProps(state) {
    return {
        session: state.session
    };
}
MenuList.category = 'menus';
MenuList.templateId = 'MenuList';
export default connect(
    mapStateToProps,
    {
        getPageDataMiddleware
    }
)(MenuList);
