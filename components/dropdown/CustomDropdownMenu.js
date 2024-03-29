import React, {useContext, useState} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const CustomDropdownMenu = React.forwardRef(
    (props, ref) => {
        const templateManager = new TemplateManager(useContext(TemplateContext));
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={{...props.style, ...{right: 0, left: "auto"}}}
                className={props.className}
                aria-labelledby={props.labeledBy}
            >
                <ul className="list-unstyled">
                    {React.Children.toArray(props.children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    }
);
CustomDropdownMenu.category = 'dropdown';
CustomDropdownMenu.templateId = 'customDropdownMenu';
export default CustomDropdownMenu;
