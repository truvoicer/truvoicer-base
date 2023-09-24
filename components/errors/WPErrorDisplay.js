import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const WPErrorDisplay = (props) => {
    const {errorData = []} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
        return (
            <div className="bg-white">
                {errorData.map((response, index) => {
                    if (!response?.errors) {
                        return null;
                    }
                    return (
                        <React.Fragment key={index}>
                            {Object.keys(response.errors).map((key, errorIndex) => {
                                if (!Array.isArray(response.errors[key])) {
                                    return null;
                                }
                                return (
                                    <React.Fragment key={errorIndex}>
                                        {response.errors[key].map((text, textIndex) => {
                                            return (
                                                <React.Fragment key={textIndex}>
                                                    <p className={"text-danger text-danger"}>{text}</p>
                                                </React.Fragment>
                                            )
                                        })}
                                    </React.Fragment>
                                )
                            })}
                        </React.Fragment>
                    )
                })}
            </div>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'wpErrorDisplay',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    });
};

export default WPErrorDisplay;
