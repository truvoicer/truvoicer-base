import {connect} from "react-redux";
import React, {useContext} from 'react';
import {getPageDataMiddleware} from "../../redux/middleware/page-middleware";
import Link from "next/link";
import {siteConfig} from "@/config/site-config";
import {logout} from "../../redux/actions/session-actions";
import {blockComponentsConfig} from "@/truvoicer-base/config/block-components-config";
import {SEARCH_REQUEST_NEW, SEARCH_STATUS_STARTED} from "../../redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {SessionContext} from "@/truvoicer-base/config/contexts/SessionContext";
import {AppContext} from "@/truvoicer-base/config/contexts/AppContext";
import {AppManager} from "@/truvoicer-base/library/app/AppManager";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {setAppLoadedAction} from "@/truvoicer-base/redux/actions/app-actions";
import {setAppRequestedRoute} from "@/truvoicer-base/redux/reducers/app-reducer";
import Nav from "react-bootstrap/Nav";
import {NavDropdown} from "react-bootstrap";

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

    const pageClickHandler = (item, e) => {
        setAppLoadedAction(false);
        setAppRequestedRoute(item?.post_url);
        // listingsManager.listingsEngine.updateContext({key: "query", value: {'loaded': true}})
        // listingsManager.getSearchEngine().setSearchRequestStatusMiddleware(SEARCH_STATUS_STARTED);
        // listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
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

    const getListItem = (item) => {
        const getCallback = getItemCallback(item.post_type);
        return (

            <Nav.Item as={'li'}>
                <Link href={item?.post_url || '#'}  onClick={
                    getCallback ? getCallback : pageClickHandler.bind(this, item)
                }>
                    {item.post_title}
                </Link>
            </Nav.Item>
        )

    }
    const getCollapseListItem = (item, subItems) => {
        return (
            <NavDropdown title={item.menu_title} className="" as={'li'}>
                {subItems.map((subItem, subIndex) => (
                    <React.Fragment key={subIndex}>
                        {getListItem(subItem)}
                    </React.Fragment>
                ))}
            </NavDropdown>
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
            <Nav className="navbar-nav" as={'ul'}>
                {/*<ul className="site-menu js-clone-nav mr-auto d-none d-lg-block">*/}
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
            </Nav>
        )
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
