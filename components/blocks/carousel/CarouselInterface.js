import React, {useContext} from 'react';
import CustomItemsCarousel from "@/truvoicer-base/components/blocks/carousel/CustomItemsCarousel";
import {buildCarouselData} from "@/truvoicer-base/library/helpers/wp-helpers";
import FullSingleTestimonialsCarousel
    from "@/truvoicer-base/components/blocks/carousel/types/Testimonials/FullSingleTestimonialsCarousel";
import CardsCarousel from "@/truvoicer-base/components/blocks/carousel/types/CardsCarousel";
import SpeechBubbleTestimonialsCarousel
    from "@/truvoicer-base/components/blocks/carousel/types/Testimonials/SpeechBubbleTestimonialsCarousel";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ApiRequestItemCarousel from "@/truvoicer-base/components/blocks/carousel/ApiRequestItemCarousel";

const CarouselInterface = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const {data} = props;
    const carouselData = buildCarouselData(data);

    const getCarousel = () => {
        switch (carouselData?.carousel_content) {
            case "custom_items":
                return templateManager.render(
                    <CustomItemsCarousel data={carouselData} />
                );
            case "full_width_testimonials":
                return templateManager.render(<FullSingleTestimonialsCarousel data={carouselData} />)
            case "speech_bubble_testimonials":
                return templateManager.render(<SpeechBubbleTestimonialsCarousel data={carouselData} />)
            case "cards":
                return templateManager.render(<CardsCarousel data={carouselData} />);
            case "request":
                return templateManager.render(
                    <ApiRequestItemCarousel data={carouselData} />
                );
            default:
                return null
        }
    }
    return getCarousel();
};

CarouselInterface.category = "carousel";
CarouselInterface.templateId = "carouselInterface";

export default CarouselInterface;
