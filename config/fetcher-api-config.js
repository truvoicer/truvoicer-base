export const fetcherApiConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_FETCHER_API_URL,
    endpoints: {
        list: "/front/category/%s/%s",
        operation: "/front/operation/%s/",
    },
    queryKey: "query",
    searchLimitKey: "page_size",
    defaultSearchLimit: 20,
    pageNumberKey: "page_number",
    pageOffsetKey: "page_offset",
    defaultOperation: "list",
    searchOperation: "list"
}
