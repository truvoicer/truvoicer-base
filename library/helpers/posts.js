import {isNotEmpty} from "../utils";
import {PostRoutes} from "../../../config/post-routes";

const sprintf = require("sprintf").sprintf

export function getPostItemUrl({post_name = null, category_name = null}) {
    if (!isNotEmpty(post_name) || !isNotEmpty(category_name)) {
        return "#";
    }

    let data = {
        post_name: post_name,
        category_name: category_name
    }
    return sprintf(PostRoutes.postItem, data);
}

export function getPostCategoryUrl({category_name = null}) {
    if (!isNotEmpty(category_name)) {
        return "#";
    }

    let data = {
        category_name: category_name
    }
    return sprintf(PostRoutes.postCategory, data);
}

export const getNextPostFromList = (currentPostIndex, posts) => {
    if (isNotEmpty(posts[currentPostIndex + 1])) {
        return posts[currentPostIndex + 1];
    }
    return {};
}
export const getPrevPostFromList = (currentPostIndex, posts) => {
    if (currentPostIndex > 0 && isNotEmpty(posts[currentPostIndex - 1])) {
        return posts[currentPostIndex - 1];
    }
    return {};
}