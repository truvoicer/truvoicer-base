import React from "react";
import CardsCarousel from "@/truvoicer-base/components/blocks/carousel/types/CardsCarousel";
import FullSingleTestimonialsCarousel
    from "@/truvoicer-base/components/blocks/carousel/types/Testimonials/FullSingleTestimonialsCarousel";

/**
 *
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
const CustomItemsCarousel = (props) => {
    if (!Array.isArray(props.data.carousel_data.item_list.data)) {
        return null;
    }

    if (!Array.isArray(props.data?.carousel_data?.carousel_settings)) {
        return null;
    }

    const settings = props.data.carousel_data.carousel_settings;

    const getSetting = (name) => {
        const setting = settings.filter(item => item.param_name === name);
        if (setting.length === 0) {
            return false;
        }
        return setting[0];
    }

    const getCarousel = () => {
        const carouselType = getSetting("carousel_type")
        switch (carouselType.param_value) {
            case "testimonials":
                return <FullSingleTestimonialsCarousel data={props.data.carousel_data} />
            case "cards":
                return <CardsCarousel data={props.data.carousel_data} />
            default:
                return null;
        }
    }

    return (
        <>
        {getCarousel()}
        </>
    )
}
export default CustomItemsCarousel;
