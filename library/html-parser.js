import React from "react";
import { domToReact } from 'html-react-parser';
import { blockComponentsConfig } from "../config/block-components-config";
import { add } from "date-fns";
import { isObject } from "./utils";
import BlockComponent from "../components/blocks/BlockComponent";
const htmlParserOptions = {
    decodeEntities: true,
    replace: (node, index) => {
        return filterHtml(node, index)
    }
}
function getWrapper(children) {
    return children;
}
function getWidget({node, data, index, styles, classes}) {
    const Component = blockComponentsConfig.components[node.attribs.id].component;
    return getWrapper(
        <BlockComponent 
            key={index} 
            data={data} 
            styles={styles} 
            classes={classes} 
        >
            <Component data={data} />
        </BlockComponent>
    );
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
        if (node?.attribs?.class &&
            node.attribs.class.includes('wp-block-columns')
        ) {
            const { styles, classes } = parseAtts(node);
            if (node?.parent === null) {
                return (
                    <div className="container section-block">
                        <div className="row">
                            <div className="col">
                                <div className={`${classes}`} style={styles}>
                                    {getWrapper(domToReact(node.children, htmlParserOptions))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            return (
                <div className={`${classes}`} style={styles}>
                    {getWrapper(domToReact(node.children, htmlParserOptions))}
                </div>
            );
        }
        if (typeof node.attribs.id !== "undefined" &&
            typeof blockComponentsConfig.components[node.attribs.id] !== "undefined") {
            const parseData = JSON.parse(node.attribs.data);
            const { styles, classes } = parseAtts(node);
            
            if (typeof callback === "function") {
                if (callback(parseData)) {
                    return getWidget({node, data: parseData, index, styles, classes});
                } else {
                    return <span></span>;
                }
            }

            return getWidget({node, data: parseData, index, styles, classes});
        }
    }
    return node;
}

function parseAtts(node) {
    let attribData = null;
    if (node?.attribs?.data) {
        attribData = JSON.parse(node.attribs.data);
    }

    let styles = attribData?.additional_styles;
    if (styles) {
        styles = cssToObj(styles);
    }
    
    let classes = node?.attribs?.class || '';
    let additionalClasses = attribData?.className || '';
    if (additionalClasses) {
        classes += ` ${additionalClasses}`;
    }
    return { styles, classes };
}

export function cssToObj(css) {
    try {
        if (!css || typeof css !== "string") {
            return {};
        }
        var obj = {}, s = css.toLowerCase().replace(/-(.)/g, function (m, g) {
            return g.toUpperCase();
        }).replace(/;\s?$/g, "").split(/:|;/g);
        for (var i = 0; i < s.length; i += 2) {
            obj[s[i].replace(/\s/g, "")] = s[i + 1].replace(/^\s+|\s+$/g, "");
        }
        return obj;
    } catch (e) {
        console.error(e);
        return {};
    }
}
