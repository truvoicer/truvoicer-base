import React from 'react';
import parse from "html-react-parser";

function HeadingWidget({html}) {
    return (
        <div>
            {parse(html || '')}
        </div>
    );
}
HeadingWidget.category = 'widgets';
HeadingWidget.templateId = 'headingWidget';
export default HeadingWidget;
