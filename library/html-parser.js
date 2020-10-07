import React from "react";
import {componentsConfig} from "../../config/components-config";

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