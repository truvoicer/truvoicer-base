import React, {useState} from 'react';
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MaterialMenuList from "./MaterialMenuList";

const MobileDrawerMenu = (props) => {
    const [showMenu, setShowMenu] = useState(false)
    const [showOpener, setShowOpener] = useState(true)

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

export default MobileDrawerMenu;
