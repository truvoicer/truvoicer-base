import React from "react";

const SocialButton = (props) => {

    return (
        <div className="btn-group social-button--group" onClick={props.onClick}>
            <a className={'btn disabled social-button--icon ' + props.buttonClass}>
                <i className={"fab " + props.iconClass} />
            </a>
            <a className={'btn social-button--label ' + props.buttonClass}> {props.buttonLabel}</a>
        </div>
    );
}
export default SocialButton;