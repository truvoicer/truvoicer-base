import MenuList from "./MenuList";
import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const HeaderMenu = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));


        return (
            <div className="main-menu  d-none d-lg-block">
                <nav>
                    {templateManager.render(<MenuList data={props.data} sessionLinks={true}/>)}
                </nav>
            </div>
        )
}
HeaderMenu.category = 'menus';
HeaderMenu.templateId = 'headerMenu';
export default HeaderMenu;
