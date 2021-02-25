import React from "react";

const StarRatings = ({starClassName, rating}) => {
    const maxRating = 5;
    const defaultRatingsClassName = "fa fa-star";

    const getRatingStars = () => {
        let ratingStars = [];
        for (let i = 1; i <= maxRating; i++) {
            ratingStars.push(
                <span className={starClassName ? starClassName : defaultRatingsClassName + (i <= rating ? " text-warning" : " text-secondary")}/>
            )
        }
        return ratingStars;
    }

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
export default StarRatings;