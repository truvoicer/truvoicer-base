import React from "react";
import {componentsConfig} from "../../config/components-config";

export const filterHtml = (node, index) => {
    if (node.type === 'tag' && node.name === 'div') {
        if(typeof node.attribs.id !== "undefined" &&
            typeof componentsConfig.components[node.attribs.id] !== "undefined")
        {
            const Component = componentsConfig.components[node.attribs.id].component;
            return <Component key={index}/>;
        }
    }
}