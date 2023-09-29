import MenuList from "./MenuList";
import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const HeaderMenu = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
    return (
        <div className="main-menu  d-none d-lg-block">
            <nav>
                <MenuList data={props.data} sessionLinks={true}/>
            </nav>
        </div>
    )
    }
    return templateManager.getTemplateComponent({
        category: 'menus',
        templateId: 'headerMenu',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    })
}
export default HeaderMenu;
