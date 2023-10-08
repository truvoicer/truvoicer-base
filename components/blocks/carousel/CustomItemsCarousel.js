import React, {useContext} from "react";
import CardsCarousel from "@/truvoicer-base/components/blocks/carousel/types/CardsCarousel";
import FullSingleTestimonialsCarousel
    from "@/truvoicer-base/components/blocks/carousel/types/Testimonials/FullSingleTestimonialsCarousel";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import NextArrow from "@/truvoicer-base/components/blocks/carousel/arrows/NextArrow";
import PrevArrow from "@/truvoicer-base/components/blocks/carousel/arrows/PrevArrow";
import Slider from "react-slick";

/**
 *
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
const CustomItemsCarousel = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    if (!Array.isArray(props.data.item_list)) {
        return null;
    }
    const defaultSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: true,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    function defaultView() {
        return (
            <div className="top_companies_area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section_title text-center mb-40">
                                <h3>{props.data.carousel_heading}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="candidate_active">
                                <Slider {...defaultSettings}>
                                    {props.data.item_list.map((item, index) => (
                                        <div className="single_company" key={index}>
                                            <div className="thumb">
                                                <img src={item.item_image} alt=""/>
                                            </div>
                                            <a href={item.item_link}><h3>{item.item_header}</h3>
                                            </a>
                                            <p>
                                                <span>{item.item_badge_text}</span> {item.item_link_text}
                                            </p>
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

    return templateManager.getTemplateComponent({
        category: 'carousel',
        templateId: 'customItemsCarousel',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            defaultSettings,
            ...props
        }
    })
}
export default CustomItemsCarousel;
