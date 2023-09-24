import Slider from "react-slick";
import React, {useContext} from "react";
import NextArrow from "@/truvoicer-base/components/blocks/carousel/arrows/NextArrow";
import PrevArrow from "@/truvoicer-base/components/blocks/carousel/arrows/PrevArrow";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

/**
 *
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
const CardsCarousel = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    if (!Array.isArray(props.data.item_list.data)) {
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
                                    {props.data.item_list.data.map((item, index) => (
                                        <div className="single_company" key={index}>
                                            <div className="thumb">
                                                <img src={item.custom_item.item_image} alt=""/>
                                            </div>
                                            <a href={item.custom_item.item_link}><h3>{item.custom_item.item_header}</h3>
                                            </a>
                                            <p>
                                                <span>{item.custom_item.item_badge_text}</span> {item.custom_item.item_link_text}
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
        templateId: 'cardsCarousel',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            defaultSettings: defaultSettings,
            ...props
        }
    });
}
export default CardsCarousel;
