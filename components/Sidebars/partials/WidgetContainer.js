import React from 'react';
import {isNotEmpty} from "@/truvoicer-base/library/utils";

function WidgetContainer({title, children}) {
    return (
        <div className="widget">
            {isNotEmpty(title) && (
                <h3 className="block-title"><span>{title}</span></h3>
            )}
            <div className="widget-content">
                {children}
            </div>
        </div>
    );
}
WidgetContainer.category = 'sidebars';
WidgetContainer.templateId = 'widgetContainer';
export default WidgetContainer;
