import React, {useContext} from "react";
import {connect} from "react-redux";
import parse from 'html-react-parser';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const EditorContent = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    return (
        <>
            {parse(props.data)}
        </>
    )
}
EditorContent.category = 'widgets';
EditorContent.templateId = 'editorContent';
export default connect(
    null
)(EditorContent);
