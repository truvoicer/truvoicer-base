import React, {useContext} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SocialButton = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function defaultView() {
        return (
            <div className="btn-group social-button--group" onClick={props.onClick}>
                <a className={'btn disabled social-button--icon ' + props.buttonClass}>
                    {props.iconClass}
                </a>
                <a className={'btn social-button--label ' + props.buttonClass}>
                    {props.buttonLabel}
                </a>
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
