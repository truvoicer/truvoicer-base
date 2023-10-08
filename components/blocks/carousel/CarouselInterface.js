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
                return <CustomItemsCarousel data={carouselData} />
            case "full_width_testimonials":
                return <FullSingleTestimonialsCarousel data={carouselData} />
            case "speech_bubble_testimonials":
                return <SpeechBubbleTestimonialsCarousel data={carouselData} />
            case "cards":
                return <CardsCarousel data={carouselData} />
            case "request":
                return <ApiRequestItemCarousel data={carouselData} />
            default:
                return null
        }
    }
    function defaultView() {
        return getCarousel();
    }

    return templateManager.getTemplateComponent({
        category: 'carousel',
        templateId: 'carouselInterface',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getCarousel: getCarousel,
            ...props
        }
    })
};

export default CarouselInterface;
