import {fetchLoaderDataAction} from "../../redux/actions/item-actions";
import {isSet} from "../../library/utils";
import React, {useState} from "react";

const {useEffect} = require("react");

const ImageListLoader = (props) => {
    const [imageList, setImageList] = useState([]);

    const fetchLoaderDataCallback = (status, data) => {
        if (status !== 200) {
            return false;
        }
        if (Array.isArray(data.request_data)) {
            setImageList(data.request_data)
        }
    }

    useEffect(() => {
        if (isSet(props.imageData.request_item) && isSet(props.imageData.request_item.request_operation)) {
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

    return (
        <ul>
            {imageList.map((item, index) => (
                <li key={index}>
                    <img src={item.url}  alt={props.item.provider}/>
                </li>
            ))}
        </ul>
    );
}
export default ImageListLoader;