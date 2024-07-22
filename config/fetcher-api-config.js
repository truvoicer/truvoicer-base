export const fetcherApiConfig = {
    endpoints: {
        list: "/front/service/%s/%s",
        operation: "/front/operation/%s/%s",
    },
    itemIdKey: "item_id",
    queryKey: "query",
    pageSizeKey: "page_size",
    pageNumberKey: "page_number",
    pageOffsetKey: "page_offset",
    defaultOperation: "list",
    searchOperation: "list",
    sortByKey: "sort_by",
    sortOrderKey: "sort_order",
    dateKey: "date_key",
    responseKeys: {
        category: 'requestCategory',
        provider: 'provider',
        service: 'service',
        serviceRequest: 'serviceRequest',
    }
}
