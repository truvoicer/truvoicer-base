import React, {useContext} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SocialButton = (props) => {
        return (
            <a className={`${(props?.id)? 'social-button--' + props.id : ''} btn-group social-button--group pointer`} onClick={props.onClick}>
                <span className={'btn disabled social-button--icon ' + props.buttonClass}>
                    {props.iconClass}
                </span>
                <span className={'social-button--label text-center'}>{props.buttonLabel}</span>
            </a>
        );
}
SocialButton.category = 'social';
SocialButton.templateId = 'socialButton';
export default SocialButton;
