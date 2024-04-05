import React from "react";
import {blockComponentsConfig} from "../config/block-components-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";

/**
 * Filters html data from wordpress page content
 * Maps elements with components depending on the elements id attribute
 * returns component if theres a match and component exists
 *
 * @param node
 * @param index
 * @returns {JSX.Element}
 */
export const filterHtml = (node, index) => {
    if (node.type === 'tag' && node.name === 'div') {
        if(typeof node.attribs.id !== "undefined" &&
            typeof blockComponentsConfig.components[node.attribs.id] !== "undefined")
        {
            const parseData = JSON.parse(node.attribs.data);
            const Component = blockComponentsConfig.components[node.attribs.id].component;
            return <Component key={index} data={parseData}/>;
        }
    }
    return node;
}
