import Slider from "react-slick";
import React, {useContext} from "react";
import ImageLoader from "../../loaders/ImageLoader";
import NextArrow from "@/truvoicer-base/components/blocks/carousel/arrows/NextArrow";
import PrevArrow from "@/truvoicer-base/components/blocks/carousel/arrows/PrevArrow";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ApiRequestItemCarousel = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const settings = {
        initialSlide: Math.round(props.data.length / 2),
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        nextArrow: templateManager.render(<NextArrow />),
        prevArrow: templateManager.render(<PrevArrow />),
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

    return (
        <Slider {...settings}>
            {props.data.map((item, index) => (
                <div className="single-games-slide" key={index}>
                    {templateManager.render(
                        <ImageLoader
                            item={item}
                            imageData={item.item_default_image}
                            className={"slide-image"}
                            background={false}
                        />
                    )}
                    <div className="slide-text">
                        <a href="#" className="game-title">{item.item_name}</a>
                        <div className="meta-data">
                            <a href="#">{item.item_rating}</a>
                            <a href="#">{"Link"}</a>
                        </div>
                    </div>
                </div>
            ))}
        </Slider>
    );
}

ApiRequestItemCarousel.category = 'carousel';
ApiRequestItemCarousel.templateId = 'requestItemCarousel';

export default ApiRequestItemCarousel;
