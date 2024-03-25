import React, {useContext} from "react";
import {connect} from "react-redux";
import parse from 'html-react-parser';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const EditorContent = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
    return (
        <>
            {parse(props.data)}
        </>
    )
    }
    return templateManager.getTemplateComponent({
        category: 'widgets',
        templateId: 'editorContent',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    })
}

export default connect(
    null
)(EditorContent);
