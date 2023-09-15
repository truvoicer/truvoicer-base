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
const FullSingleTestimonialsCarousel = (props) => {
    if (!Array.isArray(props?.data?.item_list?.data)) {
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
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>,
    };

    return (
        <div className="testimonial_area  ">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section_title text-center mb-40">
                            <h3>{props.data.carousel_heading}</h3>
                        </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="testmonial_active">
                            <Slider {...defaultSettings}>
                                {props.data.item_list.data.map((item, index) => (
                                    <div className="single_carousel" key={index}>
                                        <div className="row">
                                            <div className="col-lg-11">
                                                <div className="single_testmonial d-flex align-items-center">
                                                    <div className="thumb">
                                                        <img src={item.custom_item.item_image} alt=""/>
                                                            <div className="quote_icon">
                                                                <i className="Flaticon flaticon-quote"/>
                                                            </div>
                                                    </div>
                                                    <div className="info">
                                                        <p>{item.custom_item.item_text}</p>
                                                        <span>- {item.custom_item.item_header}</span>
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
    )
}
export default FullSingleTestimonialsCarousel;