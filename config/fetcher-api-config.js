export const fetcherApiConfig = {
    endpoints: {
        list: "/front/category/%s/%s",
        operation: "/front/operation/%s/%s",
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
