import React, {useContext} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {faAngleLeft, faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    return (
        <div className={"owl-prev"} onClick={onClick} style={{...style, display: "block"}}>
            <FontAwesomeIcon icon={faAngleLeft} />
        </div>
    );
}
PrevArrow.category = 'carousel';
PrevArrow.templateId = 'prevArrow';
export default PrevArrow;
