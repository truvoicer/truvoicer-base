import React, {useContext} from 'react';
import {isNotEmpty} from "../../../library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const CustomButton = (props) => {
    const options = props.data.custom_options;
    const templateManager = new TemplateManager(useContext(TemplateContext));


        return (
            <>
                {Array.isArray(options?.buttons) && options.buttons.map((button, index) => (
                    <a
                        key={index}
                        className="boxed-btn3"
                        href={isNotEmpty(button.link) ? button.link : ""}
                    >
                        {isNotEmpty(button.label) ? button.label : ""}
                    </a>
                ))}
            </>
        );
}
CustomButton.category = 'buttons';
CustomButton.templateId = 'customButton';
export default CustomButton;
