import {fetchLoaderDataAction} from "../../redux/actions/item-actions";
import {imageSelector, isSet} from "../../library/utils";
import React, {useState} from "react";

const {useEffect} = require("react");

const ImageLoader = (props) => {
    const [image, setImage] = useState({
        url: "https://via.placeholder.com/300x200.png"
    });

    const fetchLoaderDataCallback = (status, data) => {
        if (status !== 200) {
            return false;
        }
        if (Array.isArray(data.request_data)) {
            const getImageFromArray = imageSelector("large", data.request_data);
            if (getImageFromArray) {
                setImage({
                    url: getImageFromArray.url,
                })
            }
        } else if (isSet(data.request_data.url)) {
            setImage({
                url: data.request_data.url,
            })
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
        } else if (isSet(props.imageData) && props.imageData !== "" && props.imageData !== null) {
            setImage({
                url: props.imageData
            })
        }
    }, [props.imageData])

    return (
        <>
            <img src={image.url}  alt={props.item.provider}/>
        </>
    );
}
export default ImageLoader;