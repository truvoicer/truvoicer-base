import React, {useContext} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const SocialButton = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function defaultView() {
        return (
            <div className="btn-group social-button--group" onClick={props.onClick}>
                <a className={'btn disabled social-button--icon ' + props.buttonClass}>
                    <i className={"fab " + props.iconClass}/>
                </a>
                <a className={'btn social-button--label ' + props.buttonClass}> {props.buttonLabel}</a>
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'social',
        templateId: 'socialButton',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    });
}
export default SocialButton;
