import HtmlParser from "react-html-parser";
import React from "react";
import {formatDate, isSet} from "../utils";

const getItemImage = (url, label) => {
    return <img src={url} alt={label}/>
}

const getItemLink = (url, label) => {
    return <a href={url}>{label}</a>
}

const getItemDate = (dateString) => {
    return <div>{formatDate(dateString)}</div>
}

const getItemText = (text) => {
    return <div>{HtmlParser(text)}</div>
}

const getItemPrice = (price) => {
    return <div>{price}</div>
}

const getItemList = (config, data) => {
    if (!isSet(config) || !isSet(data)) {
        return null;
    }
    if (!Array.isArray(config.keys) || !Array.isArray(data)) {
        return null;
    }
    return (
     <ul>
         {data.map((item, index) => (
             <li key={index}>
                 {config.keys.map((key, keyIndex) => (
                     <div key={keyIndex}>
                         {getItemContentType(key.type, key.name, item, key)}
                     </div>
                 ))}
             </li>
         ))}
     </ul>
    )
}

const getItemContentType = (type, key, dataItem, config = null) => {
    switch (type) {
        case "image":
            return getItemImage(dataItem[key], config.label);
        case "link":
            return getItemLink(dataItem[key], config.label);
        case "date":
            return getItemDate(dataItem[key]);
        case "price":
            return getItemPrice(dataItem[key]);
        case "list":
            return getItemList(config.config, dataItem[key]);
        default:
            return getItemText(dataItem[key]);
    }
}

export const getListItemData = (item, dataItem) => {
    return (
        <>
            {!Array.isArray(item.dataKey)
                ?
                <>
                    {getItemContentType(item.type, item.dataKey, dataItem, item)}
                </>
                :
                <>
                    {item.dataKey.map((dataKeyName, keyIndex) => (
                        <React.Fragment key={keyIndex.toString()}>
                            {getItemContentType(item.type, item.dataKey, dataItem, item)}
                        </React.Fragment>
                    ))}
                </>
            }
        </>
    )
}