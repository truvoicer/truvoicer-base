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
                return <AuthButton data={props.data}/>
            case "custom":
                return <CustomButton data={props.data}/>
        }
    }

    function defaultView() {
        return (
            <>
                {getButton()}
            </>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'widgets',
        templateId: 'buttonWidget',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getButton,
            ...props
        }
    })
}
export default ButtonWidget;
