import React, {useContext, useState} from 'react';
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MaterialMenuList from "./MaterialMenuList";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const MobileDrawerMenu = (props) => {
    const [showMenu, setShowMenu] = useState(false)
    const [showOpener, setShowOpener] = useState(true)
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const openDrawer = () => {
        setShowMenu(true)
        setShowOpener(false)
    }

    const closeDrawer = () => {
        setShowMenu(false)
        setShowOpener(true)
    }
    function defaultView() {
    return (
            <div className="mobile_menu d-block d-lg-none">
                {showOpener &&
                <a onClick={openDrawer}
                   className="site-menu-toggle js-menu-toggle text-white">
                    <i className="fas fa-bars"/>
                </a>
                }
                <SwipeableDrawer
                    anchor={"right"}
                    open={showMenu}
                    onClose={closeDrawer}
                    onOpen={openDrawer}
                >
                    <div
                        className={""}
                        role="presentation"
                        // onClick={closeDrawer}
                        // onKeyDown={closeDrawer}
                    >
                        <MaterialMenuList data={props.data} sessionLinks={true}/>
                    </div>
                </SwipeableDrawer>
            </div>
    )
    }
    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'heroBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            buttonClickHandler: buttonClickHandler
        }
    })
}

export default MobileDrawerMenu;
