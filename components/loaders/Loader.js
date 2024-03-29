import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
const LoaderComponent = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

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

LoaderComponent.category = 'loaders';
LoaderComponent.templateId = 'loader';

export default LoaderComponent;
