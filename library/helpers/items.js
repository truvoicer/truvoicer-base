import HtmlParser from "react-html-parser";
import React from "react";
import {formatDate, isNotEmpty, isObjectEmpty, isSet, uCaseFirst} from "../utils";
import ImageLoader from "../../components/loaders/ImageLoader";
import ListLoader from "../../components/loaders/ListLoader";
import store from "../../redux/store";

export function replaceItemDataPlaceholders(pageTitle, item) {
    const test = new RegExp("\\\[+(.*?)\\]", "g");
    return pageTitle.replace(test, (match, value) => {
        if (isSet(item[value])) {
            return uCaseFirst(item[value]);
        }
        return "loading..."
    });
}

export const itemDataTextFilter = (text) => {
    const itemState = {...store.getState().item};
    if (!isSet(text)) {
        return "";
    }
    if (isNotEmpty(itemState.itemId)) {
        if (!isObjectEmpty(itemState.data)) {
            return replaceItemDataPlaceholders(text, itemState.data)
        }
        return "Loading...";
    }
    return text;
}

export const convertLinkToHttps = (url) => {
    if (!isNotEmpty(url)) {
        return url;
    }
    if (url.includes("http:")) {
        url = url.replace("http:", "https:")
    }
    return url;
}

const getItemImage = (url, label) => {
    return <img src={convertLinkToHttps(url)} alt={label}/>
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

const getListIds = (data, itemId) => {
    if (!isSet(data) || data === null || data === "") {
        return itemId;
    }
    if (Array.isArray(data)) {
        return data.join(",");
    }
    return data;
}

const getItemContentComponent = (type, key, dataItem, config = null) => {
    switch (type) {
        case "image":
            return <ImageLoader
                item={dataItem}
                imageData={dataItem[key]}
            />;
        case "list":
            return <ListLoader
                item={dataItem}
                listIds={getListIds(dataItem[key]?.data, dataItem?.item_id)}
                listData={dataItem[key]}
                listKeys={config.config.keys}
            />;
        default:
            return getItemContentType(type, key, dataItem, config);
    }
}

export const getItemContentType = (type, key, dataItem, config = null) => {
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

const getItemContent = (type, key, dataItem, config = null) => {
    if (isSet(dataItem[key]) &&
        dataItem[key] !== null &&
        isSet(dataItem[key].request_item) &&
        isSet(dataItem[key].request_item.request_operation)
    ) {
        return getItemContentComponent(type, key, dataItem, config)
    }
    return getItemContentType(type, key, dataItem, config);
}

export const getListItemData = (item, dataItem) => {
    return (
        <>
            {!Array.isArray(item.dataKey)
                ?
                <>
                    {getItemContent(item.type, item.dataKey, dataItem, item)}
                </>
                :
                <>
                    {item.dataKey.map((dataKeyName, keyIndex) => (
                        <React.Fragment key={keyIndex.toString()}>
                            {getItemContent(item.type, item.dataKey, dataItem, item)}
                        </React.Fragment>
                    ))}
                </>
            }
        </>
    )
}