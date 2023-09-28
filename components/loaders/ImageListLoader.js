import {fetchLoaderDataAction} from "../../redux/actions/item-actions";
import {isNotEmpty, isSet} from "../../library/utils";
import React, {useContext, useState} from "react";
import {convertLinkToHttps} from "../../library/helpers/items";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const {useEffect} = require("react");

const ImageListLoader = (props) => {
    const [imageList, setImageList] = useState([]);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const fetchLoaderDataCallback = (status, data) => {
        if (status !== 200) {
            return false;
        }
        if (Array.isArray(data.request_data)) {
            setImageList(data.request_data)
        }
    }

    const getUnorderedList = (imageList, provider) => {
        return (
            <ul>
                {imageList.map((item, index) => (
                    <li key={index}>
                        <img src={convertLinkToHttps(item.url)}  alt={provider}/>
                    </li>
                ))}
            </ul>
        );
    }

    const getOrderedList = (imageList, provider) => {
        return (
            <ol>
                {imageList.map((item, index) => (
                    <li key={index}>
                        <img src={convertLinkToHttps(item.url)}  alt={provider}/>
                    </li>
                ))}
            </ol>
        );
    }

    const getDivList = (imageList, provider) => {
        return (
            <>
                {imageList.map((item, index) => (
                    <div key={index}>
                        <img src={convertLinkToHttps(item.url)}  alt={provider}/>
                    </div>
                ))}
            </>
        );
    }

    const getList = (imageList, provider) => {
        switch (props.listType) {
            case "div":
                return getDivList(imageList, provider);
            case "ol":
                return getOrderedList(imageList, provider);
            case "ul":
            default:
                return getUnorderedList(imageList, provider);
        }
    }
    useEffect(() => {
        if (isNotEmpty(props.imageData) &&
            isSet(props.imageData.request_item) &&
            isSet(props.imageData.request_item.request_operation)) {
            fetchLoaderDataAction(
                props.imageData.request_item.request_operation,
                {
                    query: props.item.item_id,
                    provider: props.item.provider
                },
                fetchLoaderDataCallback
            )
        }
    }, [props.imageData])

    function defaultView() {
    return (
        <>
            {getList(imageList, props.item.provider)}
        </>
    );
    }
    return templateManager.getTemplateComponent({
        category: 'loaders',
        templateId: 'imageListLoader',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            buttonClickHandler: buttonClickHandler
        }
    })
}
export default ImageListLoader;
