import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const TextWidget = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
    return (
        <div className="col-xl-3 col-md-6 col-lg-3">
            <div className="footer_widget wow fadeInUp" data-wow-duration="1.3s" data-wow-delay=".6s">
                <h3 className="footer_title">
                    <h4>{props.data.title}</h4>
                </h3>
                <p>{props.data.text}</p>
            </div>
        </div>
    );
    }
    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'heroBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            buttonClickHandler: buttonClickHandler
        }
    })
}

export default TextWidget;
