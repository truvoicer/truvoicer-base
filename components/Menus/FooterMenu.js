import MenuList from "./MenuList";
import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const FooterMenu = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    return (
        <div className="col-xl-2 col-md-6 col-lg-2">
            <div className="footer_widget wow fadeInUp" data-wow-duration="1.1s" data-wow-delay=".4s">
                <h3 className="footer_title">
                    {props.data.title}
                </h3>

                {templateManager.render(<MenuList data={props.data}/>)}

            </div>
        </div>
    )
}
FooterMenu.category = 'menus';
FooterMenu.templateId = 'footerMenu';
export default FooterMenu;
