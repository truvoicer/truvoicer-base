import React from "react";

const StarRatings = (props) => {
    const maxRating = 5;
    const rating = props.rating;
    const defaultRatingsClassName = "fa fa-star";

    const getRatingStars = () => {
        let ratingStars = [];
        for (let i = 1; i <= maxRating; i++) {
            ratingStars.push(
                <span className={props.starClassName ? props.starClassName : defaultRatingsClassName + (i <= rating ? " text-warning" : " text-secondary")}/>
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