const publicEndpoint = "wp/tru-fetcher-api/public";
const protectedEndpoint = "wp/tru-fetcher-api/protected";
export const wpApiConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_WP_API_URL,
    endpoints: {
        token: "jwt-auth/v1/token",
        validateToken: "jwt-auth/v1/token/validate",
        menu: publicEndpoint + "/pages/menu/%s",
        sidebar: publicEndpoint + "/pages/sidebar/%s",
        passwordReset: publicEndpoint + "/users/password-reset",
        passwordResetValidate: publicEndpoint + "/users/password-reset/validate",
        createUser: publicEndpoint + "/users/create",
        updateUser: protectedEndpoint + "/users/update",
        userAccountDataRequest: protectedEndpoint + "/users/account/data/request",
        userProfileUpdate: protectedEndpoint + "/user/profile/update",
        userMetaDataRequest: protectedEndpoint + "/user/metadata/request",
        saveItem: protectedEndpoint + "/users/item/save",
        saveItemRating: protectedEndpoint + "/users/item/rating/save",
        savedItemsList: protectedEndpoint + "/users/item/list",
        savedItemsListByUser: protectedEndpoint + "/users/item/list-by-user",
        commentsByItemId: publicEndpoint + "/comments/list/%(category)s/%(provider)s/%(item_id)s",
        commentsByUserId: publicEndpoint + "/comments/user/%(data.user_id)d/list",
        createComment: protectedEndpoint + "/comments/create",
        updateComment: protectedEndpoint + "/comments/update",
        formsEmail: publicEndpoint + "/forms/email",
        formsUserMeta: protectedEndpoint + "/forms/user/metadata/save",
        formsUserMetaDataRequest: protectedEndpoint + "/forms/user/metadata/request",
        formsProgressRequest: protectedEndpoint + "/forms/progress/request",
        formsCustomPublic: publicEndpoint + "%s",
        formsCustomProtected: protectedEndpoint + "%s",
        generalData: publicEndpoint + "/general/%s"
    }
}