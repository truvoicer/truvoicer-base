import React, {useContext} from 'react';
import parse from 'html-react-parser';
import {isNotEmpty} from "../../library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const CustomHtmlWidget = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

        return (
            <div className="">
                {props?.data?.title &&
                    <h3 className="footer_title">
                        {props.data.title}
                    </h3>
                }
                {Array.isArray(props?.data) && props?.data.map((item, index) => (
                    <React.Fragment key={index}>
                        {isNotEmpty(item?.attrs?.content) ? parse(item.attrs.content) : ""}
                    </React.Fragment>
                ))}
            </div>
        );
}
CustomHtmlWidget.category = 'widgets';
CustomHtmlWidget.templateId = 'customHtmlWidget';
export default CustomHtmlWidget;
