import MenuList from "./MenuList";
import React from 'react';

const HeaderMenu = (props) => {
    return (
        <div className="main-menu  d-none d-lg-block">
            <nav>
                <MenuList data={props.data} sessionLinks={true}/>
            </nav>
        </div>
    )
}
export default HeaderMenu;