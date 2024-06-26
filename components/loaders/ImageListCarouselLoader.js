import {Carousel} from 'react-responsive-carousel';
import React, {useContext, useEffect, useState} from "react";
import {isNotEmpty, isSet} from "../../library/utils";
import {fetchLoaderDataAction} from "../../redux/actions/item-actions";
import {convertLinkToHttps} from "../../library/helpers/items";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const ImageListCarouselLoader = (props) => {
    const carouselClassName = "basic-carousel " + (props.className ? props.className : "");
    const leftArrowClassName = "basic-carousel--left-arrow " + (props.leftArrowClassName ? props.leftArrowClassName : "");
    const rightArrowClassName = "basic-carousel--right-arrow " + (props.rightArrowClassName ? props.rightArrowClassName : "");

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
    function loaderDataRequest() {

        fetchLoaderDataAction(
            props.imageData.request_item.request_operation,
            {
                query: props.item.item_id,
                provider: props.item.provider
            },
            fetchLoaderDataCallback
        )
    }
    useEffect(() => {
        if (isSet(props.request) && !props.request) {
            setImageList(props.imageData)
            return;
        }
        if (isNotEmpty(props.imageData) &&
            isSet(props.imageData.request_item) &&
            isSet(props.imageData.request_item.request_operation)) {
            loaderDataRequest();
        }
    }, [props.imageData])


    return (
        <>
            {Array.isArray(imageList) && imageList.length > 0 &&
            <Carousel
                infiniteLoop
                swipeable={true}
                useKeyboardArrows={true}
                showIndicators={false}
                showArrows={true}
                showStatus={false}
                showThumbs={false}
                className={carouselClassName}
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                    hasPrev && (
                        <div className={leftArrowClassName} onClick={onClickHandler}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                    )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                    hasNext && (
                        <div className={rightArrowClassName} onClick={onClickHandler}>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                    )
                }
            >
                {Array.isArray(imageList) && imageList.map((item, index) => (
                    <div key={index}>
                        <img  className={props.imageClassName? props.imageClassName : ""} src={convertLinkToHttps(item.url)} alt={props.item.provider}/>
                    </div>
                ))}
            </Carousel>
            }
        </>
    )
}
ImageListCarouselLoader.category = 'loaders';
ImageListCarouselLoader.templateId = 'imageListCarouselLoader';
export default ImageListCarouselLoader;
