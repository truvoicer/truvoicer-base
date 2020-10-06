import React from "react";
import {connect} from "react-redux";
import HtmlParser from "react-html-parser";

const EditorContent = (props) => {
    console.log(props)
    return (
        <>
            {HtmlParser(props.data)}
        </>
    )
}

export default connect(
    null
)(EditorContent);