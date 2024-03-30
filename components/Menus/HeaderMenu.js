import MenuList from "./MenuList";
import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const HeaderMenu = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));


    return (
        <nav className="navbar navbar-expand-lg col">
            <div className="site-nav-inner float-left">
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="true" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="navbarSupportedContent" className="collapse navbar-collapse navbar-responsive-collapse">

                    {templateManager.render(<MenuList data={props.data} sessionLinks={true}/>)}
                </div>
            </div>
        </nav>
    )
}
HeaderMenu.category = 'menus';
HeaderMenu.templateId = 'headerMenu';
export default HeaderMenu;
