export const fetcherApiConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_FETCHER_API_URL,
    endpoints: {
        list: "/front/category/%s/%s",
        operation: "/front/operation/%s/",
    },
    itemIdKey: "item_id",
    queryKey: "query",
    searchLimitKey: "page_size",
    pageNumberKey: "page_number",
    pageOffsetKey: "page_offset",
    defaultOperation: "list",
    searchOperation: "list",
    responseKeys: {
        category: 'requestCategory',
        provider: 'provider',
        service: 'service',
        serviceRequest: 'serviceRequest',
    }
}
