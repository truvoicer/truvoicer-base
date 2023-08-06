import {connect} from "react-redux";

import React, {useState} from 'react';
import {getPageDataMiddleware, setModalContentMiddleware} from "../../redux/middleware/page-middleware";
import {useRouter} from "next/router";
import {
    setSearchRequestOperationMiddleware,
    setSearchRequestStatusMiddleware
} from "../../redux/middleware/search-middleware";
import {logout} from "../../redux/actions/session-actions";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {isSet} from "../../library/utils";
import {siteConfig} from "../../../config/site-config";
// import makeStyles from "@mui/material/styles/makeStyles";
import {componentsConfig} from "../../../config/components-config";
import ListSubheader from "@mui/material/ListSubheader";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_STARTED} from "../../redux/constants/search-constants";

const MaterialMenuList = (props) => {
    const router = useRouter();
    const [expand, setExpand] = useState({
        open: false,
        menu_name: ""
    })
    const logoutHandler = (e) => {
        e.preventDefault();
        logout();
    }

    const expandCLickHandler = (itemName, e) => {
        setExpand({
            open: !expand.open,
            itemName: itemName
        })
    }

    const pageClickHandler = async (item, e) => {
        if (isSet(item.post_url) && item.post_url !== "") {
            props.setSearchRequestStatusMiddleware(SEARCH_REQUEST_STARTED);
            props.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
            router.push(item.post_url, item.post_url)
        }
    }

    const showAuthLoginModal = () => {
        props.setModalContentMiddleware(componentsConfig.components.authentication_login.name, {}, true)
    }
    const showAuthRegisterModal = () => {
        props.setModalContentMiddleware(componentsConfig.components.authentication_register.name, {}, true)
    }

    const getListItem = (item, isChild = false) => {
        const getCallback = getItemCallback(item.post_type);
        return (
            <ListItem button
                      className={isChild ? classes.nested : ""}
                      onClick={
                          getCallback ? getCallback : pageClickHandler.bind(this, item)
                      }
            >
                <ListItemText primary={item.menu_title}/>
            </ListItem>
        )
    }

    const getCollapseListItem = (item, subItems) => {
        return (
            <>
                <ListItem button
                          className="has-children"
                          onClick={expandCLickHandler.bind(this, item.post_name)}
                >
                    <ListItemText primary={item.menu_title}/>
                    {expand.open && expand.itemName === item.post_name
                        ? <ExpandMore/>
                        : <ExpandLess/>
                    }
                </ListItem>
                <Collapse
                    in={(expand.open && expand.itemName === item.post_name)}
                    timeout="auto"
                    unmountOnExit
                >
                    <List
                        component="div"
                        disablePadding
                    >
                        {subItems.map((subItem, subIndex) => (
                            <React.Fragment key={subIndex}>
                                {getListItem(subItem, true)}
                            </React.Fragment>
                        ))}
                    </List>
                </Collapse>
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
    // const useStyles = makeStyles((theme) => ({
    //     root: {
    //         width: '100%',
    //         maxWidth: 360,
    //         backgroundColor: theme.palette.background.paper,
    //     },
    //     nested: {
    //         paddingLeft: theme.spacing(4),
    //     },
    // }));
    // const classes = useStyles();
    return (
            <List
                component="div"
                disablePadding
                // className={classes.root}
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        {props.data.title? props.data.title : siteConfig.defaultMobileMenuTitle}
                    </ListSubheader>
                }
            >
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
            </List>
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
        setSearchRequestOperationMiddleware,
        setSearchRequestStatusMiddleware,
        setModalContentMiddleware
    }
)(MaterialMenuList);
