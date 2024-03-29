import React, {useContext} from 'react';
import AuthButton from "./Buttons/AuthButton";
import CustomButton from "./Buttons/CustomButton";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ButtonWidget = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getButton = () => {
        switch (props.data.button_type) {
            case "auth":
                return templateManager.render(<AuthButton data={props.data}/>)
            case "custom":
                return templateManager.render(<CustomButton data={props.data}/>)
        }
    }


        return (
            <>
                {getButton()}
            </>
        );
}
ButtonWidget.category = 'widgets';
ButtonWidget.templateId = 'buttonWidget';
export default ButtonWidget;
