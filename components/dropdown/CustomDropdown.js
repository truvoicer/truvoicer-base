import React, {useContext, useState} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

export const CustomDropdownMenu = React.forwardRef(
    (props, ref) => {
        const templateManager = new TemplateManager(useContext(TemplateContext));
        const [value, setValue] = useState('');
        function defaultView() {
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
        return templateManager.getTemplateComponent({
            category: 'dropdown',
            templateId: 'customDropdownMenu',
            defaultComponent: defaultView(),
            props: {
                defaultView: defaultView,
                value: value,
                setValue: setValue,
                ...props
            }
        })
    },
);

export const CustomDropdownToggle = React.forwardRef((props, ref) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
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
    }
    return templateManager.getTemplateComponent({
        category: 'dropdown',
        templateId: 'customDropdownToggle',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    })
});
