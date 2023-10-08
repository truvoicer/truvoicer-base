import Slider from "react-slick";
import React, {useContext} from "react";
import Image from "next/image";
import NextArrow from "../../arrows/NextArrow";
import PrevArrow from "../../arrows/PrevArrow";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

/**
 *
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
const SpeechBubbleTestimonialsCarousel = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    if (!Array.isArray(props?.data?.item_list)) {
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
            const itemData = props.data?.item_list;
            return (
                <div className={"slick-dots"}>
                {dots.map((item, index) => {
                    return (
                        <a
                            key={index}
                            className={"slick-dot-item"}
                            onClick={item.props.children.props.onClick}
                        >
                            <img src={itemData?.[index]?.item_image} alt=""/>
                        </a>
                    )
                })}
                </div>
            )
        },
    };

    function defaultView() {
        return (
            <div className="testimonial_area speech-bubble">
                <Slider {...defaultSettings}>
                    {Array.isArray(props?.data?.item_list) && props.data.item_list.map((item, index) => (
                        <div className="single_carousel" key={index}>
                            <div className="row">
                                <div className="col-lg-11">
                                    <div className="single_testimonial d-flex align-items-center">
                                        <div className="info">
                                            <p>{item.item_text}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'carousel',
        templateId: 'speechBubbleTestimonialsCarousel',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    })
}
export default SpeechBubbleTestimonialsCarousel;
