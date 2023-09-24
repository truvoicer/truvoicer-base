import React, {useContext} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
        return (
            <div className={"owl-prev"} onClick={onClick} style={{...style, display: "block"}}>
                <i className="fa fa-angle-left"/>
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'carousel',
        templateId: 'prevArrow',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    });
}
export default PrevArrow;
