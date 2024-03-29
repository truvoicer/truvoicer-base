import React, {useContext, useState} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import MenuList from "@/truvoicer-base/components/Menus/MenuList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight, faBars} from "@fortawesome/free-solid-svg-icons";

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

    return (
            <div className="mobile_menu d-block d-lg-none">
                {showOpener &&
                <a onClick={openDrawer}
                   className="site-menu-toggle js-menu-toggle text-white">
                    <FontAwesomeIcon icon={faBars} />
                </a>
                }
                {/*<SwipeableDrawer*/}
                {/*    anchor={"right"}*/}
                {/*    open={showMenu}*/}
                {/*    onClose={closeDrawer}*/}
                {/*    onOpen={openDrawer}*/}
                {/*>*/}
                {/*    <div*/}
                {/*        className={""}*/}
                {/*        role="presentation"*/}
                {/*        // onClick={closeDrawer}*/}
                {/*        // onKeyDown={closeDrawer}*/}
                {/*    >*/}
                {/*        {templateManager.render(<MenuList data={props.data} sessionLinks={true}/>)}*/}
                {/*    </div>*/}
                {/*</SwipeableDrawer>*/}
            </div>
    )
}
MobileDrawerMenu.category = 'menus';
MobileDrawerMenu.templateId = 'mobileDrawerMenu';
export default MobileDrawerMenu;
