import React from "react";
import {componentsConfig} from "../../config/components-config";

export const filterHtml = (node, index) => {
    if (node.type === 'tag' && node.name === 'div') {
        if(typeof node.attribs.id !== "undefined" &&
            typeof componentsConfig.components[node.attribs.id] !== "undefined")
        {
            console.log("Parsing wp block Data...")
            const parseData = JSON.parse(node.attribs.data);
console.log(parseData)
            console.log("Parsed wp block Data")
            const Component = componentsConfig.components[node.attribs.id].component;
            return <Component key={index} data={parseData}/>;
        }
    }
}