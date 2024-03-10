import React, {useContext} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {faAngleRight, faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
        return (
            <div className={"owl-next"} onClick={onClick} style={{...style, display: "block"}}>
                <FontAwesomeIcon icon={faAngleRight} />
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'carousel',
        templateId: 'nextArrow',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    });
}
export default NextArrow;
