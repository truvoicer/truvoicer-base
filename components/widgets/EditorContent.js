import React, {useContext} from "react";
import {connect} from "react-redux";
import HtmlParser from "react-html-parser";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const EditorContent = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
    return (
        <>
            {HtmlParser(props.data)}
        </>
    )
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

export default connect(
    null
)(EditorContent);
