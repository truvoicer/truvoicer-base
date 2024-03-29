import React, {useContext} from 'react';
import parse from 'html-react-parser';
import {isNotEmpty} from "../../library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const CustomHtmlWidget = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));


        return (
            <div className="col-xl-3 col-md-6 col-lg-3">
                <div className="footer_widget wow fadeInUp" data-wow-duration="1.3s" data-wow-delay=".6s">
                    {props?.data?.title &&
                        <h3 className="footer_title">
                            {props.data.title}
                        </h3>
                    }
                    {isNotEmpty(props?.data?.content) ? parse(props.data.content) : ""}
                </div>
            </div>
        );
}
CustomHtmlWidget.category = 'widgets';
CustomHtmlWidget.templateId = 'customHtmlWidget';
export default CustomHtmlWidget;
