const publicEndpoint = "wp/tru-fetcher-api/public";
const protectedEndpoint = "wp/tru-fetcher-api/protected";
export const wpApiConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_WP_API_URL,
    endpoints: {
        token: "jwt-auth/v1/token",
        validateToken: "jwt-auth/v1/token/validate",
        menu: publicEndpoint + "/pages/menu/%s",
        passwordReset: publicEndpoint + "/users/password-reset",
        passwordResetValidate: publicEndpoint + "/users/password-reset/validate",
        createUser: publicEndpoint + "/users/create",
        updateUser: publicEndpoint + "/users/update",
        saveItem: protectedEndpoint + "/users/item/save",
        saveItemRating: protectedEndpoint + "/users/item/rating/save",
        savedItemsList: protectedEndpoint + "/users/item/list",
        savedItemsListByUser: protectedEndpoint + "/users/item/list-by-user",
        commentsByItemId: publicEndpoint + "/comments/list/%(category)s/%(provider)s/%(item_id)s",
        commentsByUserId: publicEndpoint + "/comments/user/%(data.user_id)d/list",
        createComment: protectedEndpoint + "/comments/create",
        updateComment: protectedEndpoint + "/comments/update",
        formsEmail: publicEndpoint + "/forms/email",
        formsUserMeta: protectedEndpoint + "/forms/user-meta",
        formsUserProfile: protectedEndpoint + "/forms/user/profile",
        formsUserMetaDataRequest: protectedEndpoint + "/forms/user/profile/data",
        formsCustomPublic: publicEndpoint + "%s",
        formsCustomProtected: protectedEndpoint + "%s",
        generalData: publicEndpoint + "/general/%s"
    }
}