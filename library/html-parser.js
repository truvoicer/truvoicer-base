import React from "react";
import {componentsConfig} from "../../config/components-config";

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
            typeof componentsConfig.components[node.attribs.id] !== "undefined")
        {
            console.log("parsing block data...", node.attribs.id)
            console.log(node.attribs.data)
            const parseData = JSON.parse(node.attribs.data);
            console.log("parsed block data", node.attribs.id)

            const Component = componentsConfig.components[node.attribs.id].component;
            return <Component key={index} data={parseData}/>;
        }
    }
}