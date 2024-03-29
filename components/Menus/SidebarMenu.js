import MenuList from "./MenuList";
import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const SidebarMenu = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

        return (
            <nav id="menu">
                <header className="major">
                    {props.data.title}
                </header>
                {templateManager.render(<MenuList data={props.data}/>)}
            </nav>
        )
}
SidebarMenu.category = 'menus';
SidebarMenu.templateId = 'sidebarMenu';
export default SidebarMenu;
