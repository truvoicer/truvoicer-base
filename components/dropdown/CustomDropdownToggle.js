import React, {useContext, useState} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const CustomDropdownToggle = React.forwardRef((props, ref) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    return (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                props.onClick(e);
            }}
        >
            {props.children}
        </a>
    )
});
CustomDropdownToggle.category = 'dropdown';
CustomDropdownToggle.templateId = 'customDropdownToggle';
export default CustomDropdownToggle;
