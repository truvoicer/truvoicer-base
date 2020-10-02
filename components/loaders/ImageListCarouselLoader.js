import {Carousel} from 'react-responsive-carousel';
import React, {useEffect, useState} from "react";
import {isNotEmpty, isSet} from "../../library/utils";
import {fetchLoaderDataAction} from "../../redux/actions/item-actions";

const ImageListCarouselLoader = (props) => {
    const carouselClassName = "basic-carousel " + (props.className ? props.className : "");
    const leftArrowClassName = "basic-carousel--left-arrow " + (props.leftArrowClassName ? props.leftArrowClassName : "");
    const rightArrowClassName = "basic-carousel--right-arrow " + (props.rightArrowClassName ? props.rightArrowClassName : "");

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

    return (
        <>
            {imageList.length > 0 &&
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
                            <i className="fa fa-angle-left"/>
                        </div>
                    )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                    hasNext && (
                        <div className={rightArrowClassName} onClick={onClickHandler}>
                            <i className="fa fa-angle-right"/>
                        </div>
                    )
                }
            >
                {imageList.map((item, index) => (
                    <div key={index}>
                        <img src={item.url} alt={props.item.provider}/>
                    </div>
                ))}
            </Carousel>
            }
        </>
    )
}
export default ImageListCarouselLoader;