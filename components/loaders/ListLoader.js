import {fetchLoaderDataAction} from "../../redux/actions/item-actions";
import {isSet} from "../../library/utils";
import React, {useContext, useState} from "react";
import {getItemContentType} from "../../library/helpers/items";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const {useEffect} = require("react");

const ListLoader = (props) => {
    const [list, setList] = useState([]);
    const defaultLinkLabel = "Link";
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const fetchLoaderDataCallback = (status, data) => {
        if (status !== 200) {
            return false;
        }
        if (Array.isArray(data.request_data)) {
            setList(data.request_data)
        }
    }

    function loaderDataRequest() {

        fetchLoaderDataAction(
            props.listData.request_item.request_operation,
            {
                query: props.listIds,
                provider: props.item.provider
            },
            fetchLoaderDataCallback
        )
    }

    useEffect(() => {
        if (isSet(props.listData.request_item) && isSet(props.listData.request_item.request_operation)) {
            loaderDataRequest();
        }
    }, [props.listData])
    const getConfigObject = (key, item) => {
        let config = {...key};
        config.label = defaultLinkLabel;
        if (isSet(key.label) && key.label !== null && key.label !== "" && isSet(item[key.label])) {
            config.label = item[key.label];
        }
        return config;
    }


        return (
            <ul>
                {list.map((item, index) => (
                    <li key={index}>
                        {props.listKeys.map((key, keyIndex) => (
                            <div key={keyIndex}>
                                {templateManager.render(getItemContentType(key.type, key.name, item, getConfigObject(key, item)))}
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        );
}
ListLoader.category = 'loaders';
ListLoader.templateId = 'listLoader';
export default ListLoader;
