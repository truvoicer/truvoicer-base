import {isNotEmpty} from "../utils";
import {PostRoutes} from "../../../config/post-routes";

const sprintf = require("sprintf").sprintf

export function getPostItemUrl({post_name = null}) {
    if (!isNotEmpty(post_name)) {
        return "#";
    }

    let data = {
        post_name: post_name
    }
    return sprintf(PostRoutes.postItem, data);
}