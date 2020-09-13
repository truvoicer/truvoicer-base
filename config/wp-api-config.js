import {siteConfig} from "../../config/site-config";

export const wpApiConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_WP_API_URL,
    endpoints: {
        posts: "wp/v2/public/posts",
        page: "wp/v2/public/page/",
        pages: "wp/v2/public/pages",
        template: "wp/v2/public/template/item-view/%s",
        media: "wp/v2/public/media",
        menu: "wp/v2/public/menu/%s",
        sidebar: "wp/v2/public/sidebar/" + siteConfig.sidebarName,
        topBar: "wp/v2/public/sidebar/" + siteConfig.topBarName,
        footer: "wp/v2/public/sidebar/" + siteConfig.footerName,
        settings: "wp/v2/public/settings",
        token: "jwt-auth/v1/token",
        validateToken: "jwt-auth/v1/token/validate",
        createUser: "wp/v2/public/users/create",
        updateUser: "wp/v2/public/users/update",
        saveItem: "wp/v2/public/users/item/save",
        saveItemRating: "wp/v2/public/users/item/rating/save",
        savedItemsList: "wp/v2/public/users/item/list",
        savedItemsListByUser: "wp/v2/public/users/item/list-by-user",
    }
}