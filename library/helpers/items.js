import HtmlParser from "react-html-parser";
import React from "react";
import {formatDate} from "../utils";

const getItemImage = (item, dataItem) => {
    return (
        <>
            {!Array.isArray(item.dataKey)
                ?
                <img src={dataItem[item.dataKey]}  alt={item.label}/>
                :
                <>
                    {item.dataKey.map((dataKeyName, keyIndex) => (
                        <React.Fragment key={keyIndex.toString()}>
                            <img src={dataItem[dataKeyName]}  alt={item.label}/>
                        </React.Fragment>
                    ))}
                </>
            }
        </>
    )
}


const getItemLink = (item, dataItem) => {
    return (
        <>
            {!Array.isArray(item.dataKey)
                ?
                <a href={dataItem[item.dataKey]}>{item.label}</a>
                :
                <>
                    {item.dataKey.map((dataKeyName, keyIndex) => (
                        <React.Fragment key={keyIndex.toString()}>
                            <a href={dataItem[dataKeyName]}>{item.label}</a>
                        </React.Fragment>
                    ))}
                </>
            }
        </>
    )
}

const getItemDate = (item, dataItem) => {
    return (
        <>
            {!Array.isArray(item.dataKey)
                ?
                <div>{formatDate(dataItem[item.dataKey])}</div>
                :
                <>
                    {item.dataKey.map((dataKeyName, keyIndex) => (
                        <React.Fragment key={keyIndex.toString()}>
                            <div>{formatDate(dataItem[dataKeyName])}</div>
                        </React.Fragment>
                    ))}
                </>
            }
        </>
    )
}

const getItemPrice = (item, dataItem) => {
    return (
        <>
            {!Array.isArray(item.dataKey)
                ?
                <div>{dataItem[item.dataKey]}</div>
                :
                <>
                    {item.dataKey.map((dataKeyName, keyIndex) => (
                        <React.Fragment key={keyIndex.toString()}>
                            <div>{dataItem[dataKeyName]}</div>
                        </React.Fragment>
                    ))}
                </>
            }
        </>
    )
}

export const getListItemData = (item, dataItem) => {
    switch (item.type) {
        case "image":
            return getItemImage(item, dataItem);
        case "link":
            return getItemLink(item, dataItem);
        case "date":
            return getItemDate(item, dataItem);
        case "price":
            return getItemPrice(item, dataItem);
        default:
            return (
                <>
                    {!Array.isArray(item.dataKey)
                        ?
                        <div>{HtmlParser(dataItem[item.dataKey])}</div>
                        :
                        <>
                            {item.dataKey.map((dataKeyName, keyIndex) => (
                                <React.Fragment key={keyIndex.toString()}>
                                    <div>{HtmlParser(dataItem[dataKeyName])}</div>
                                </React.Fragment>
                            ))}
                        </>
                    }
                </>
            )
    }
}