import Slider from "react-slick";
import React from "react";
import NextArrow from "../../arrows/NextArrow";
import PrevArrow from "../../arrows/PrevArrow";

/**
 *
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
const SpeechBubbleTestimonialsCarousel = (props) => {
    if (!Array.isArray(props?.data?.item_list?.data)) {
        return null;
    }
    const defaultSettings = {
        arrows: false,
        dots: true,
        dotsClass: "slick-dots",
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: false,
        adaptiveHeight: true,
        appendDots: (dots) => {
            const itemData = props.data.item_list.data;
            return (
                <div className={"slick-dots"}>
                {dots.map((item, index) => {
                    return (
                        <a
                            key={index}
                            className={"slick-dot-item"}
                            onClick={item.props.children.props.onClick}
                        >
                            <img src={itemData[index].custom_item.item_image} alt=""/>
                        </a>
                    )
                })}
                </div>
            )
        },
    };

    return (
        <div className="testimonial_area speech-bubble">
            <Slider {...defaultSettings}>
                {props.data.item_list.data.map((item, index) => (
                    <div className="single_carousel" key={index}>
                        <div className="row">
                            <div className="col-lg-11">
                                <div className="single_testimonial d-flex align-items-center">
                                    <div className="info">
                                        <p>{item.custom_item.item_text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}
export default SpeechBubbleTestimonialsCarousel;
