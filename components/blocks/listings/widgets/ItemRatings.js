import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {isSet} from "@/truvoicer-base/library/utils";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import {faStar} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const sprintf = require('sprintf-js').sprintf;

const ItemRatings = ({
    provider,
    category,
    item_id,
    user_id,
    ratingsData = {},
}) => {
    const [rating, setRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const modalContext = useContext(AppModalContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const maxRating = 5;

    function getStarIconProps(index) {
        if (index <= rating) {
            return {
                icon: fullStar,
            }
        }
        return {
            icon: faStar,
        }
    }

    const getRatingStars = () => {
        let ratingStars = [];
        for (let i = 1; i <= maxRating; i++) {
            ratingStars.push(
                <a
                    className={"item-ratings--star"}
                    onClick={(e) => {
                        ratingClickHandler(i, e)
                    }}
                >
                    <FontAwesomeIcon {...getStarIconProps(i)} />
                </a>
            )
        }
        return ratingStars;
    }


    const ratingClickHandler = async (index, e) => {
        e.preventDefault()
        if (!listingsManager.showAuthModal(modalContext)) {
            return false;
        }
        const data = {
            provider_name: provider,
            category: category,
            item_id: item_id,
            user_id: user_id,
            rating: index,
        }
        const response = await wpResourceRequest({
            method: "POST",
            endpoint: wpApiConfig.endpoints.saveItemRating,
            data,
            protectedReq: true,
        });
        const responseData = await response.json();

        if (responseData?.status !== "success") {
            console.error("Error saving rating", responseData);
            return;
        }
        const overall_rating = responseData?.itemRatings?.overall_rating;
        const total_users_rated = responseData?.itemRatings?.total_users_rated;
        if (!isSet(overall_rating)) {
            console.error("Error saving rating", responseData);
            return;
        }
        if (!isSet(total_users_rated)) {
            console.error("Error saving rating", responseData);
            return;
        }

        setRating(overall_rating);
        setRatingCount(total_users_rated);
    }
    useEffect(() => {
        setRating((isSet(ratingsData?.rating)) ? parseInt(ratingsData.rating) : 0);
        setRatingCount(isSet(ratingsData?.total_users_rated) ? parseInt(ratingsData.total_users_rated) : 0);
    }, [ratingsData]);
    return (
        <div className={"item-ratings"}>
            {getRatingStars().map((item, index) => (
                <React.Fragment key={index}>
                    {item}
                </React.Fragment>
            ))}
            <span className="review item-ratings--reviews">{sprintf(" (%d users rated)", ratingCount)}</span>
        </div>
    );
}
export default connect(
    null,
    null
)(ItemRatings);
