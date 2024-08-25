import React, {useContext} from 'react';
import WidgetContainer from "@/truvoicer-base/components/Sidebars/partials/WidgetContainer";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function WidgetGroup({children, widgets = [], title}) {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    return (
        <WidgetContainer title={title || ''}>
            <div className={'widget-group'}>
                {widgets.map((item, index) => {
                    if (Array.isArray(item) && item.length > 0) {
                        return templateManager.render(
                            <WidgetGroup key={index.toString()} widgets={item}/>
                        )
                    }

                    if (!item) {
                        return null;
                    }

                    if (!item?.component) {
                        return null;
                    }
                    return templateManager.render(item.component);
                })}
            </div>
        </WidgetContainer>
    );
}

WidgetGroup.category = 'sidebars';
WidgetGroup.templateId = 'widgetGroup';
export default WidgetGroup;
