import React, {useContext} from 'react';
import {connect} from "react-redux";
import parse from 'html-react-parser';
import BlogCategoryList from "../BlogCategoryList";
import {isNotEmpty, isObjectEmpty, isSet} from "../../../library/utils";
import {getNextPostFromList, getPostItemUrl, getPrevPostFromList} from "../../../library/helpers/posts";
import Link from "next/link";
import {setPostNavIndexAction} from "../../../redux/actions/page-actions";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ItemViewComments from "@/truvoicer-base/components/comments/ItemViewComments";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight, faHeart} from "@fortawesome/free-solid-svg-icons";
import {faBehance, faDribbble, faFacebookF, faTwitter} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {DISPLAY_AS, DISPLAY_AS_LIST} from "@/truvoicer-base/redux/constants/general_constants";
import {SESSION_USER_EMAIL, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";

const PostNavigation = ({
    navigation = {},
    source
}) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const listingsManager = new ListingsManager();
    function getItemUrl(item) {
        return listingsManager.getListingsEngine().getItemLinkProps({
            displayAs: DISPLAY_AS_LIST,
            item,
            source,
            // trackData: {
            //     dataLayerName: "listItemClick",
            //     dataLayer: {
            //         provider: props.data.provider,
            //         category: props.searchCategory,
            //         item_id: props.data.item_id,
            //         user_id: props.user[SESSION_USER_ID] || "unregistered",
            //         user_email: props.user[SESSION_USER_EMAIL] || "unregistered",
            //     },
            // }
        })
    }

    const getNextPost = () => {
        if (!isNotEmpty(navigation?.nextPost)) {
            return {};
        }
        return navigation.nextPost;
    }

    const getPrevPost = () => {
        if (!isNotEmpty(navigation.prevPost)) {
            return {};
        }
        return navigation.prevPost;
    }

    const prevPostClickHandler = () => {
    }

    const nextPostClickHandler = () => {
    }

    function getCategory(categories) {
        if (Array.isArray(categories) && categories?.length > 0) {
            return categories[0]
        }
        return null
    }

    const prevPost = getPrevPost();
    const nextPost = getNextPost();

    if (isObjectEmpty(prevPost) && isObjectEmpty(nextPost)) {
        return null;
    }

    const prevPostCategory = getCategory(prevPost?.categories);
    const nextPostCategory = getCategory(nextPost?.categories);
    return (
            <nav className="post-navigation clearfix">
                <div className="post-previous">
                    <Link {...getItemUrl(prevPost)}>
                        <span><FontAwesomeIcon icon={faAngleLeft} />Previous Post</span>
                        <h3>
                            {prevPost?.post_title}
                        </h3>
                    </Link>
                </div>
                <div className="post-next">
                    <Link {...getItemUrl(nextPost)}>
                        <span>Next Post <FontAwesomeIcon icon={faAngleRight} /></span>
                        {/*<img className="img-fluid"*/}
                        {/*     src={nextPost?.featured_image}*/}
                        {/*     alt=""/>*/}
                        <h3>
                            {nextPost?.post_title}
                        </h3>
                    </Link>
                </div>
            </nav>
    );
};

PostNavigation.category = 'post';
PostNavigation.templateId = 'postNavigation';

export default PostNavigation;
