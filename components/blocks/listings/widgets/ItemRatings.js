import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import {faStar} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const sprintf = require('sprintf-js').sprintf;

const ItemRatings = (props) => {
    const [userRating, setUserRating] = useState(0);
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const modalContext = useContext(AppModalContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const maxRating = 5;
    let rating = 0;
    let user_rating_count = 0;

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
        for (let i = 1;i<=maxRating;i++) {
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
    function saveRatingsRequestCallback(error, data, rating) {
        if (error) {
            console.error(error);
            return;
        }
        if (data?.status === "success") {
            setUserRating(rating);
        }
    }
    const ratingClickHandler = async (index, e) => {
        e.preventDefault()
        if (!listingsManager.showAuthModal(modalContext)) {
            return false;
        }
        const data = {
            provider_name: props.provider,
            category: props.category,
            item_id: props.item_id,
            user_id: props.user_id,
            rating: index,
        }
        const response = await protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.saveItemRating),
            data
        )
        if (!response) {
            saveRatingsRequestCallback(true, {}, index)
        } else {
            saveRatingsRequestCallback(false, response, index)
        }
    }
    useEffect(() => {
        if (isSet(props.ratingsData) && !isObjectEmpty(props.ratingsData)) {
            if (isSet(props.ratingsData.rating) && !isNaN(props.ratingsData.rating)) {
                rating = parseInt(props.ratingsData.rating);
            }
            if (isSet(props.ratingsData.total_users_rated) && !isNaN(props.ratingsData.total_users_rated)) {
                user_rating_count = parseInt(props.ratingsData.total_users_rated);
            }
            setUserRating(user_rating_count)
        }
    }, [props.ratingsData]);
    return (
        <div className={"item-ratings"}>
            {getRatingStars().map((item, index) => (
                <React.Fragment key={index}>
                    {item}
                </React.Fragment>
            ))}
            <span className="review item-ratings--reviews">{sprintf(" (%d users rated)", userRating)}</span>
        </div>
    );
}
export default connect(
    null,
    null
)(ItemRatings);
