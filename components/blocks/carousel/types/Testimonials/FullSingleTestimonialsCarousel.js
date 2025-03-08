import Slider from "react-slick";
import React, {useContext} from "react";
import NextArrow from "../../arrows/NextArrow";
import PrevArrow from "../../arrows/PrevArrow";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Image from "next/image";

/**
 *
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
const FullSingleTestimonialsCarousel = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    if (!Array.isArray(props?.data?.item_list)) {
        return null;
    }
    const defaultSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: false,
        nextArrow: templateManager.render(<NextArrow/>),
        prevArrow: templateManager.render(<PrevArrow/>),
    };

        return (
            <div className="testimonial_area  ">
                <div className="container section-block">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section_title text-center mb-40">
                                <h3>{props.data.carousel_heading}</h3>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="testmonial_active">
                                <Slider {...defaultSettings}>
                                    {props.data.item_list.map((item, index) => (
                                        <div className="single_carousel" key={index}>
                                            <div className="row">
                                                <div className="col-lg-11">
                                                    <div className="single_testmonial d-flex align-items-center">
                                                        <div className="thumb">
                                                            <img  src={item.item_image} alt=""/>
                                                            <div className="quote_icon">
                                                                <i className="Flaticon flaticon-quote"/>
                                                            </div>
                                                        </div>
                                                        <div className="info">
                                                            <p>{item.item_text}</p>
                                                            <span>- {item.item_header}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}
FullSingleTestimonialsCarousel.category = 'carousel';
FullSingleTestimonialsCarousel.templateId = 'fullSingleTestimonialsCarousel';
export default FullSingleTestimonialsCarousel;
