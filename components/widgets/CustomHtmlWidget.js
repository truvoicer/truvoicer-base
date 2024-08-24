import React, {useContext} from 'react';
import parse from 'html-react-parser';
import {isNotEmpty, isObject} from "../../library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {connect} from "react-redux";
import {replaceItemDataPlaceholders} from "@/truvoicer-base/library/helpers/wp-helpers";

const CustomHtmlWidget = ({data, item}) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const widgetData = data?.attrs || {};
    let content = widgetData?.content || '';
    if (isObject(item?.data)) {
        content = replaceItemDataPlaceholders(content, item.data);
    }
    return (
        <div className="">
            {isNotEmpty(content) ? parse(content) : ""}
        </div>
    );
}
CustomHtmlWidget.category = 'widgets';
CustomHtmlWidget.templateId = 'customHtmlWidget';

function mapStateToProps(state) {
    return {
        item: state.item,
    };
}

export default connect(
    mapStateToProps,
    null
)(CustomHtmlWidget);
