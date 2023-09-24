import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
const LoaderComponent = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
        return (
            <div className={"loader-wrapper d-flex justify-content-center align-items-center"}>
                <div className="loader">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'loaders',
        templateId: 'loader',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    });
}

export default LoaderComponent;
