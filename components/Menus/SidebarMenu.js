import MenuList from "./MenuList";
import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const SidebarMenu = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function defaultView() {
        return (
            <nav id="menu">
                <header className="major">
                    {props.data.title}
                </header>
                <MenuList data={props.data}/>
            </nav>
        )
    }

    return templateManager.getTemplateComponent({
        category: 'menus',
        templateId: 'sidebarMenu',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    })
}
export default SidebarMenu;
