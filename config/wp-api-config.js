const publicEndpoint = "wp/tru-fetcher-api/public";
const protectedEndpoint = "wp/tru-fetcher-api/protected";
export const wpApiConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_WP_API_URL,
    endpoints: {
        token: "jwt-auth/v1/token",
        validateToken: "jwt-auth/v1/token/validate",
        createUser: protectedEndpoint + "/users/create",
        updateUser: protectedEndpoint + "/users/update",
        saveItem: protectedEndpoint + "/users/item/save",
        saveItemRating: protectedEndpoint + "/users/item/rating/save",
        savedItemsList: protectedEndpoint + "/users/item/list",
        savedItemsListByUser: protectedEndpoint + "/users/item/list-by-user",
    }
}