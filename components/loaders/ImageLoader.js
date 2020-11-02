import {fetchLoaderDataAction} from "../../redux/actions/item-actions";
import {imageSelector, isNotEmpty, isSet} from "../../library/utils";
import React, {useState} from "react";
import {convertLinkToHttps} from "../../library/helpers/items";

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
        if (isSet(props.request) && !props.request) {
            setImage({
                url: props.imageData
            })
            return;
        }
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
        } else if (isSet(props.imageData) && props.imageData !== "" && props.imageData !== null) {
            setImage({
                url: props.imageData
            })
        }
    }, [props.imageData])

    return (
        <>
            {props.background ?
                <div className={props.className ? props.className : ""}
                     style={{backgroundImage: "url(" + convertLinkToHttps(image.url) + ")"}}/>
                :
                <img className={props.className ? props.className : ""} src={convertLinkToHttps(image.url)} alt={props.item.provider}/>
            }

        </>
    );
}
export default ImageLoader;