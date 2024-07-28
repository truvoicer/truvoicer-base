import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {AppModalContext} from "@/truvoicer-base/config/contexts/AppModalContext";
import {faHeart, faHeartBroken, faPencil, faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SavedItemToggle = (props) => {
    const [savedItem, setSavedItem] = useState(false);
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const modalContext = useContext(AppModalContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    function saveItemRequestCallback(error, data) {
        if (error) {
            console.error(error);
            return;
        }
        if (data?.status === "success") {
            setSavedItem(!savedItem);
        }
    }
    function getIconProps() {
        if (savedItem) {
            return {
                icon: faHeart,
            }
        }
        return {
            icon: faHeartBroken,
        }
    }

    useEffect(() => {
        if (!props.savedItem) {
            return;
        }
        setSavedItem(props.savedItem);
    }, [props.savedItem]);
    return (
        <a
            onClick={async (e) => {
                if (!listingsManager.showAuthModal(modalContext)) {
                    return;
                }
                const data = {
                    provider_name: props.provider,
                    category: props.category,
                    item_id: props.item_id,
                    user_id: props.user_id
                }
                const response = await protectedApiRequest(
                    buildWpApiUrl(wpApiConfig.endpoints.saveItem),
                    data
                )
                saveItemRequestCallback(false, response);
            }}

            className={"heart_mark" + (savedItem ? " active" : "")}
        >
            <FontAwesomeIcon {...getIconProps()} />
        </a>
    );
}
export default connect(
    null,
    null
)(SavedItemToggle);
