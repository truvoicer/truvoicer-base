import React, {useContext} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const StarRatings = ({starClassName, rating}) => {
    const maxRating = 5;
    const defaultRatingsClassName = "fa fa-star";
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getRatingStars = () => {
        let ratingStars = [];
        for (let i = 1; i <= maxRating; i++) {
            ratingStars.push(
                <span className={starClassName ? starClassName : defaultRatingsClassName + (i <= rating ? " text-warning" : " text-secondary")}/>
            )
        }
        return ratingStars;
    }

    function defaultView() {
    return (
        <>
            {getRatingStars().map((item, index) => (
                <React.Fragment key={index}>
                    {item}
                </React.Fragment>
            ))}
        </>
    )
    }
    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'heroBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            buttonClickHandler: buttonClickHandler
        }
    })
}
export default StarRatings;
