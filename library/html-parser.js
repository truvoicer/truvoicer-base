import React from "react";
import { domToReact } from 'html-react-parser';
import {blockComponentsConfig} from "../config/block-components-config";
const htmlParserOptions = {
        decodeEntities: true,
        replace: (node, index) => {
            return filterHtml(node, index)
        }
    }
function getWidget(id, data, index) {
    const Component = blockComponentsConfig.components[id].component;
    return <Component key={index} data={data}/>;
}
/**
 * Filters html data from wordpress page content
 * Maps elements with components depending on the elements id attribute
 * returns component if theres a match and component exists
 *
 * @param node
 * @param index
 * @param callback
 * @returns {JSX.Element}
 */
export const filterHtml = (node, index, callback) => {
    if (node.type === 'tag' && node.name === 'div') {
        //TODO: create parent container/row/class divs
        if (node?.attribs?.class && node.attribs.class.includes('wp-block-columns') && node?.parent === null) {
        
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            {domToReact(node.children, htmlParserOptions)}
                        </div>
                    </div>
                </div>
            );
        }
        if(typeof node.attribs.id !== "undefined" &&
            typeof blockComponentsConfig.components[node.attribs.id] !== "undefined")
        {
            const parseData = JSON.parse(node.attribs.data);
            if (typeof callback === "function") {
                if (callback(parseData)) {
                    return getWidget(node.attribs.id, parseData, index);
                } else {
                    return <span></span>;
                }
            }

            const Component = blockComponentsConfig.components[node.attribs.id].component;
            return <Component key={index} data={parseData}/>;
        }
    }
    return node;
}
