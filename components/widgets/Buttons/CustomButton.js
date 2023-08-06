import React from 'react';
import {isNotEmpty} from "../../../library/utils";

const CustomButton = (props) => {
    const options = props.data.custom_options;
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
export default CustomButton;
