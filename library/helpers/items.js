import parse from 'html-react-parser';
import React from "react";
import {formatDate, isNotEmpty, isObjectEmpty, isSet, uCaseFirst} from "../utils";
import ImageLoader from "../../components/loaders/ImageLoader";
import ListLoader from "../../components/loaders/ListLoader";
import store from "../../redux/store";
import {getItemViewUrl} from "../../redux/actions/item-actions";
import {tagManagerSendDataLayer} from "../api/global-scripts";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/wp-helpers";

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
    const postDataState = {...store.getState().page.postData};

    if (!isNotEmpty(text)) {
        return "";
    }
    if (isNotEmpty(postDataState)) {
        if (!isObjectEmpty(postDataState)) {
            return replaceItemDataPlaceholders(text, {
                post_title: postDataState.title,
                title: postDataState.title
            })
        }
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
    return <div>{parse(text)}</div>
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

export function filterItemIdDataType(itemId) {
    if (!isNaN(itemId)) {
        itemId = parseInt(itemId);
    }
    return itemId;
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

export const getListItemData = (item, dataItem, templateManager) => {
    return (
        <>
            {!Array.isArray(item.dataKey)
                ?
                <>
                    {templateManager.render(getItemContent(item.type, item.dataKey, dataItem, item))}
                </>
                :
                <>
                    {item.dataKey.map((dataKeyName, keyIndex) => (
                        <React.Fragment key={keyIndex.toString()}>
                            {templateManager.render(getItemContent(item.type, item.dataKey, dataItem, item))}
                        </React.Fragment>
                    ))}
                </>
            }
        </>
    )
}

export const getDataKeyValue = (dataItem) => {
    switch (dataItem.value_type) {
        case "text":
            return dataItem.data_item_value;
        case "url":
            return dataItem.data_item_value;
        case "color":
            return dataItem.data_item_value;
        case "html":
            return dataItem.data_item_value;
        case "number":
            return parseInt(dataItem.data_item_value)
        case "date":
            return dataItem.data_item_value;
        case "true_false":
            return dataItem.data_item_value === true || dataItem.data_item_value === "true";
        case "image":
            return dataItem.data_item_value;
        case "image_list":
            return dataItem.data_item_value;
        case "array":
            return dataItem.data_item_value;
        default:
            return null;
    }
}

export const convertDataKeysDataArrayObject = (dataKeyList) => {
    let dataKeyObject = {};
    dataKeyList.map((item) => {
        dataKeyObject[item.data_item_key] = getDataKeyValue(item)
    })
    return dataKeyObject;
}



export const globalItemLinkClick = (trackData = {}) => {
    tagManagerSendDataLayer(trackData)
}

export const getItemLinkProps = (category, item, showInfoCallback, e, trackData = {}) => {
    const listingsData = store.getState().listings?.listingsData;
    if (isSet(listingsData?.item_view_display) && listingsData.item_view_display === "page") {
        return {
            onClick: (e) => {
                // e.preventDefault()
                globalItemLinkClick(trackData)
            }
        };
    }
    return {
        href: getItemViewUrl(item, category),
        onClick: showInfoCallback.bind(e, item, category)
    }
}
export function extractItemListFromPostArray({posts = []}) {
    if (!Array.isArray(posts)) {
        return [];
    }
    let listData = [];
    posts.forEach(post => {
        listData.push({
            ID: post?.ID,
            post_title: post?.post_title,
            post_type: post?.post_type,
            item_list: extractItemListFromPost({post})
        })
    })
    return listData;
}
